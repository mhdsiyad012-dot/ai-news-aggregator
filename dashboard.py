"""PulseAI news dashboard backed by the project's shared database connection."""

import os
from html import escape
from urllib.parse import urlsplit

import streamlit as st
from sqlalchemy import select
from sqlalchemy.exc import SQLAlchemyError


st.set_page_config(
    page_title="PulseAI • Daily Tech Digest",
    page_icon="⚡",
    layout="wide",
    initial_sidebar_state="expanded",
)

# Streamlit Cloud provides Secrets as environment variables. Also support a
# local .streamlit/secrets.toml file without committing credentials.
try:
    secret_url = st.secrets.get("DATABASE_URL")
except FileNotFoundError:
    secret_url = None
if secret_url:
    os.environ["DATABASE_URL"] = secret_url

from database import DATABASE_URL, NewsArticle, SessionLocal  # noqa: E402


st.markdown(
    """
<style>
    @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');
    html, body, [class*="css"], [data-testid="stApp"] {
        font-family: 'Plus Jakarta Sans', sans-serif;
    }
    [data-testid="stApp"] { background: #0b1120; color: #f8fafc; }
    .block-container { padding-top: 2rem; padding-bottom: 4rem; max-width: 1200px; }
    .hero-container {
        background: linear-gradient(135deg, rgba(255,255,255,0.05), rgba(255,255,255,0.01));
        border: 1px solid rgba(255,255,255,0.1);
        border-radius: 18px;
        padding: 2.2rem 2.5rem;
        margin-bottom: 2rem;
        backdrop-filter: blur(10px);
    }
    .hero-badge {
        display: inline-block; padding: 4px 12px; font-size: 0.75rem;
        font-weight: 700; letter-spacing: 0.05em; text-transform: uppercase;
        background: rgba(99,102,241,0.2); color: #a5b4fc;
        border: 1px solid rgba(99,102,241,0.3); border-radius: 9999px;
        margin-bottom: 0.8rem;
    }
    .hero-title {
        font-size: 2.3rem; font-weight: 800; letter-spacing: -0.02em; margin: 0;
        background: linear-gradient(90deg, #ffffff, #cbd5e1);
        -webkit-background-clip: text; -webkit-text-fill-color: transparent;
    }
    .hero-subtitle { color: #94a3b8; font-size: 1rem; margin: 0.4rem 0 0; }
    .news-card {
        background: rgba(30,41,59,0.45); border: 1px solid rgba(255,255,255,0.08);
        border-radius: 14px; padding: 1.4rem; margin-bottom: 1.2rem;
        transition: transform 0.2s ease, border-color 0.2s ease;
    }
    .news-card:hover { transform: translateY(-2px); border-color: rgba(99,102,241,0.4); }
    .card-tag {
        display: inline-block; font-size: 0.72rem; font-weight: 600; color: #38bdf8;
        background: rgba(56,189,248,0.12); padding: 3px 10px;
        border-radius: 6px; margin-bottom: 0.7rem;
    }
    .card-title {
        font-size: 1.15rem; font-weight: 700; line-height: 1.4;
        margin-bottom: 0.6rem; color: #f8fafc;
    }
    .card-summary {
        font-size: 0.92rem; line-height: 1.6; color: #cbd5e1;
        margin-bottom: 1.1rem; white-space: pre-wrap;
    }
    .card-btn {
        display: inline-flex; align-items: center; gap: 6px;
        font-size: 0.82rem; font-weight: 600; color: #ffffff !important;
        background: #4f46e5; padding: 6px 14px; border-radius: 8px;
        text-decoration: none !important; transition: background 0.15s ease;
    }
    .card-btn:hover { background: #4338ca; }
</style>
""",
    unsafe_allow_html=True,
)


@st.cache_data(ttl=300)
def load_articles() -> list[dict[str, str]]:
    with SessionLocal() as db:
        articles = db.scalars(select(NewsArticle).order_by(NewsArticle.id.desc())).all()
        return [
            {
                "title": article.title,
                "summary": article.summary,
                "url": article.url,
                "category": article.category,
            }
            for article in articles
        ]


def safe_article_url(value: str) -> str | None:
    parsed = urlsplit(value)
    if parsed.scheme in {"http", "https"} and parsed.netloc:
        return escape(value, quote=True)
    return None


st.markdown(
    """
<div class="hero-container">
    <span class="hero-badge">AI Powered Feed</span>
    <h1 class="hero-title">PulseAI Tech Digest</h1>
    <p class="hero-subtitle">Curated tech headlines summarized daily with Google Gemini.</p>
</div>
""",
    unsafe_allow_html=True,
)

st.sidebar.markdown("### Feed Controls")
search_term = st.sidebar.text_input(
    "Search news", placeholder="Keywords, topics, companies..."
).strip().casefold()

if st.sidebar.button("Refresh Feed", use_container_width=True):
    load_articles.clear()
    st.rerun()

st.sidebar.markdown("---")
st.sidebar.caption("Daily run scheduled via GitHub Actions at 07:30 AM IST.")

if not DATABASE_URL:
    st.warning("DATABASE_URL is not set. Showing the local SQLite demo database.")

try:
    articles = load_articles()
except SQLAlchemyError:
    st.error("Could not read articles. Check DATABASE_URL and the database connection.")
    st.stop()

categories = sorted({article["category"] for article in articles if article["category"]})
selected_cat = st.sidebar.selectbox("Filter category", ["All Categories", *categories])

if not articles:
    st.info("No articles found yet. Run the GitHub Actions workflow to add the latest batch.")
else:
    filtered = [
        article
        for article in articles
        if (selected_cat == "All Categories" or article["category"] == selected_cat)
        and (
            not search_term
            or search_term in article["title"].casefold()
            or search_term in article["summary"].casefold()
        )
    ]

    m1, m2, m3 = st.columns(3)
    m1.metric("Total Stories", len(articles))
    m2.metric("Matching Filter", len(filtered))
    m3.metric("Live Source", "TechCrunch RSS")
    st.markdown("<div style='height: 1.2rem;'></div>", unsafe_allow_html=True)

    if not filtered:
        st.info("No stories match your search or category.")

    columns = st.columns(2)
    for index, article in enumerate(filtered):
        article_url = safe_article_url(article["url"])
        link = (
            f'<a href="{article_url}" target="_blank" rel="noopener noreferrer" '
            'class="card-btn">Read original story ↗</a>'
            if article_url
            else ""
        )
        with columns[index % 2]:
            st.markdown(
                f"""
<div class="news-card">
    <span class="card-tag">{escape(article['category'])}</span>
    <div class="card-title">{escape(article['title'])}</div>
    <div class="card-summary">{escape(article['summary'])}</div>
    {link}
</div>
""",
                unsafe_allow_html=True,
            )
