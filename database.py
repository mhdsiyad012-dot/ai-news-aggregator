"""Database connection shared by the journalist, dashboard, and local API."""

import os
from pathlib import Path

from sqlalchemy import Column, Integer, String, Text, create_engine
from sqlalchemy.engine import URL
from sqlalchemy.orm import declarative_base, sessionmaker
from sqlalchemy.pool import NullPool


DB_PATH = Path(__file__).resolve().parent / "news.db"
DATABASE_URL = os.environ.get("DATABASE_URL", "").strip()

if DATABASE_URL and not DATABASE_URL.startswith("sqlite:"):
    # SQLAlchemy expects postgresql://, while some services show postgres://.
    # NullPool is suitable for Supabase's transaction pooler (port 6543).
    url = DATABASE_URL.replace("postgres://", "postgresql://", 1)
    engine = create_engine(
        url,
        poolclass=NullPool,
        pool_pre_ping=True,
        connect_args={"sslmode": "require", "connect_timeout": 10},
    )
else:
    # A local fallback keeps the old demo usable without cloud credentials.
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


def init_db() -> None:
    # The Supabase schema is applied once during setup (see sql/). The daily
    # journalist must not run DDL against the cloud database.
    if engine.dialect.name == "sqlite":
        Base.metadata.create_all(bind=engine)
