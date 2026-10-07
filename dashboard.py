"""Streamlit dashboard for local SQLite or a Supabase Postgres database."""

import streamlit as st
from sqlalchemy import select
from sqlalchemy.exc import SQLAlchemyError

from database import DATABASE_URL, NewsArticle, SessionLocal


st.set_page_config(page_title="My Daily Tech News", layout="wide")
st.title("Your Personal Tech & AI Digest")
st.caption("Headlines come from publisher RSS feeds. Summaries use Gemini when available.")

if not DATABASE_URL:
    st.warning("DATABASE_URL is not set. Showing the local SQLite demo database.")

if st.button("Refresh news"):
    st.rerun()

try:
    with SessionLocal() as db:
        articles = db.scalars(
            select(NewsArticle).order_by(NewsArticle.id.desc()).limit(200)
        ).all()
except SQLAlchemyError as exc:
    st.error(f"Could not read articles: {exc.__class__.__name__}. Check DATABASE_URL and run the journalist first.")
    st.stop()

if not articles:
    st.info("No articles yet. Run the journalist or trigger the GitHub workflow.")
else:
    categories = sorted({article.category for article in articles})
    selected = st.sidebar.selectbox("Filter by category", ["All"] + categories)

    for article in articles:
        if selected != "All" and article.category != selected:
            continue
        st.subheader(article.title)
        st.caption(article.category)
        st.write(article.summary)
        st.link_button("Read full article", article.url)
        st.divider()
