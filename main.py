"""Local API for saving and reading news articles."""

from contextlib import asynccontextmanager
from typing import Annotated

from fastapi import Depends, FastAPI, HTTPException
from pydantic import BaseModel, ConfigDict, Field, HttpUrl
from sqlalchemy import select
from sqlalchemy.dialects.postgresql import insert as postgres_insert
from sqlalchemy.dialects.sqlite import insert as sqlite_insert
from sqlalchemy.orm import Session

import database


@asynccontextmanager
async def lifespan(app: FastAPI):
    database.init_db()
    yield


app = FastAPI(title="Local Tech News API", lifespan=lifespan)


class ArticleIn(BaseModel):
    title: str = Field(min_length=1, max_length=300)
    summary: str = Field(min_length=1)
    url: HttpUrl
    category: str = Field(min_length=1, max_length=100)


class ArticleOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    title: str
    summary: str
    url: str
    category: str


def get_db():
    db = database.SessionLocal()
    try:
        yield db
    finally:
        db.close()


DbSession = Annotated[Session, Depends(get_db)]


@app.post("/api/news/")
def create_news(articles: list[ArticleIn], db: DbSession):
    if not articles:
        raise HTTPException(status_code=400, detail="Send at least one article.")

    values = [
        {**article.model_dump(), "url": str(article.url)} for article in articles
    ]
    insert = postgres_insert if db.bind.dialect.name == "postgresql" else sqlite_insert
    statement = insert(database.NewsArticle).values(values)
    statement = statement.on_conflict_do_nothing(index_elements=["url"])
    result = db.execute(statement)
    db.commit()
    return {"message": "Articles processed successfully.", "saved": result.rowcount}


@app.get("/api/news/", response_model=list[ArticleOut])
def get_news(db: DbSession):
    statement = select(database.NewsArticle).order_by(database.NewsArticle.id.desc())
    return db.scalars(statement).all()
