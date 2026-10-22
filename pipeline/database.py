"""Database models and connection logic for Supabase PostgreSQL and local SQLite."""

import os
from datetime import datetime
from pathlib import Path
from sqlalchemy import Boolean, Column, DateTime, Integer, String, Text, create_engine
from sqlalchemy.engine import URL, make_url
from sqlalchemy.orm import declarative_base, sessionmaker
from sqlalchemy.pool import NullPool
from sqlalchemy.dialects.postgresql import ARRAY

PIPELINE_DIR = Path(__file__).resolve().parent
REPO_ROOT = PIPELINE_DIR.parent
DB_PATH = REPO_ROOT / "news.db"
env_file = REPO_ROOT / ".env"
if env_file.exists():
    for line in env_file.read_text(encoding="utf-8").splitlines():
        line = line.strip()
        if "=" in line and not line.startswith("#"):
            k, v = line.split("=", 1)
            k = k.strip()
            v = v.strip().strip('"').strip("'")
            if k not in os.environ and v:
                os.environ[k] = v

DATABASE_URL = os.environ.get("DATABASE_URL", "").strip()

if DATABASE_URL and not DATABASE_URL.startswith("sqlite:"):
    # SQLAlchemy expects postgresql://, while some services show postgres://.
    # NullPool is suitable for Supabase transaction pooler (port 6543).
    url = make_url(DATABASE_URL.replace("postgres://", "postgresql://", 1))
    if url.drivername in {"postgresql", "postgresql+psycopg"}:
        url = url.set(drivername="postgresql+psycopg2")
    engine = create_engine(
        url,
        poolclass=NullPool,
        pool_pre_ping=True,
        connect_args={
            "sslmode": "require",
            "connect_timeout": 15,
            "client_encoding": "utf8",
        },
    )
else:
    # Local fallback keeps dev functional without remote credentials.
    engine = create_engine(
        DATABASE_URL or URL.create("sqlite", database=str(DB_PATH)),
        connect_args={"check_same_thread": False, "timeout": 30},
    )

SessionLocal = sessionmaker(bind=engine, autoflush=False, expire_on_commit=False)
Base = declarative_base()


class NewsArticle(Base):
    __tablename__ = "articles"

    id = Column(Integer, primary_key=True)
    title = Column(String(300), nullable=False)
    summary = Column(Text, nullable=False)
    url = Column(String(2048), nullable=False, unique=True, index=True)
    category = Column(String(100), nullable=False, index=True)
    source_name = Column(String(100), nullable=True, default="Intelligence Wire")
    related_tools = Column(ARRAY(Text).with_variant(Text, "sqlite"), nullable=True, default=list)
    is_pinned = Column(Boolean, nullable=False, default=False)
    published_at = Column(DateTime(timezone=True).with_variant(String(100), "sqlite"), nullable=True, default=datetime.utcnow)
    read_time_minutes = Column(Integer, nullable=True, default=3)
    created_at = Column(DateTime(timezone=True).with_variant(DateTime, "sqlite"), nullable=True, default=datetime.utcnow)


class AIDirectoryItem(Base):
    __tablename__ = "ai_directory"

    id = Column(Integer, primary_key=True)
    slug = Column(String(100), nullable=False, unique=True, index=True)
    name = Column(String(200), nullable=False)
    creator = Column(String(200), nullable=False)
    short_purpose = Column(String(500), nullable=False)
    primary_category = Column(String(100), nullable=False, index=True)
    tags = Column(ARRAY(Text).with_variant(Text, "sqlite"), nullable=False)
    detailed_overview = Column(Text, nullable=False)
    key_capabilities = Column(ARRAY(Text).with_variant(Text, "sqlite"), nullable=False)
    best_use_cases = Column(ARRAY(Text).with_variant(Text, "sqlite"), nullable=False)
    pricing_model = Column(String(200), nullable=False)
    official_url = Column(String(2048), nullable=False)
    release_status = Column(String(100), nullable=False, default="Generally Available")
    is_featured = Column(Boolean, nullable=False, default=False)
    created_at = Column(DateTime, nullable=True, default=datetime.utcnow)


def init_db() -> None:
    """Initialize database tables and run automatic migrations if needed."""
    Base.metadata.create_all(bind=engine)
    if engine.dialect.name == "sqlite":
        with engine.connect() as conn:
            # Check articles columns
            cursor = conn.exec_driver_sql("PRAGMA table_info(articles)").fetchall()
            existing_art_cols = {row[1] for row in cursor}
            if "source_name" not in existing_art_cols:
                conn.exec_driver_sql("ALTER TABLE articles ADD COLUMN source_name VARCHAR(100) DEFAULT 'Intelligence Wire'")
            if "related_tools" not in existing_art_cols:
                conn.exec_driver_sql("ALTER TABLE articles ADD COLUMN related_tools TEXT DEFAULT ''")
            if "is_pinned" not in existing_art_cols:
                conn.exec_driver_sql("ALTER TABLE articles ADD COLUMN is_pinned BOOLEAN DEFAULT 0")
            if "published_at" not in existing_art_cols:
                conn.exec_driver_sql("ALTER TABLE articles ADD COLUMN published_at VARCHAR(100) DEFAULT 'Recent'")

            # Check ai_directory columns
            cursor = conn.exec_driver_sql("PRAGMA table_info(ai_directory)").fetchall()
            existing_dir_cols = {row[1] for row in cursor}
            if "is_featured" not in existing_dir_cols:
                conn.exec_driver_sql("ALTER TABLE ai_directory ADD COLUMN is_featured BOOLEAN DEFAULT 0")
            if "created_at" not in existing_dir_cols:
                conn.exec_driver_sql("ALTER TABLE ai_directory ADD COLUMN created_at DATETIME")
            conn.commit()
    elif engine.dialect.name == "postgresql":
        with engine.connect() as conn:
            conn.exec_driver_sql("ALTER TABLE articles ADD COLUMN IF NOT EXISTS source_name VARCHAR(100) DEFAULT 'Intelligence Wire'")
            conn.exec_driver_sql("ALTER TABLE articles ADD COLUMN IF NOT EXISTS related_tools TEXT DEFAULT ''")
            conn.exec_driver_sql("ALTER TABLE articles ADD COLUMN IF NOT EXISTS is_pinned BOOLEAN NOT NULL DEFAULT FALSE")
            conn.exec_driver_sql("ALTER TABLE articles ADD COLUMN IF NOT EXISTS published_at VARCHAR(100) DEFAULT 'Recent'")
            conn.exec_driver_sql("ALTER TABLE articles ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ DEFAULT NOW()")
            conn.exec_driver_sql("ALTER TABLE ai_directory ADD COLUMN IF NOT EXISTS is_featured BOOLEAN NOT NULL DEFAULT FALSE")
            conn.exec_driver_sql("ALTER TABLE ai_directory ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ DEFAULT NOW()")
            conn.commit()
