"use client";

import { useState, useEffect } from "react";

const BOOKMARKS_STORAGE_KEY = "pulseai_saved_library_v1";

interface SavedLibraryData {
  toolSlugs: string[];
  articleIds: number[];
}

function getStoredData(): SavedLibraryData {
  if (typeof window === "undefined") {
    return { toolSlugs: [], articleIds: [] };
  }
  try {
    const raw = localStorage.getItem(BOOKMARKS_STORAGE_KEY);
    if (!raw) return { toolSlugs: [], articleIds: [] };
    const parsed = JSON.parse(raw);
    return {
      toolSlugs: Array.isArray(parsed.toolSlugs) ? parsed.toolSlugs : [],
      articleIds: Array.isArray(parsed.articleIds) ? parsed.articleIds : [],
    };
  } catch {
    return { toolSlugs: [], articleIds: [] };
  }
}

function setStoredData(data: SavedLibraryData) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(BOOKMARKS_STORAGE_KEY, JSON.stringify(data));
    window.dispatchEvent(new Event("pulseai_bookmarks_changed"));
  } catch (err) {
    console.error("Failed to save bookmarks to localStorage", err);
  }
}

export function useBookmarks() {
  const [savedData, setSavedData] = useState<SavedLibraryData>({
    toolSlugs: [],
    articleIds: [],
  });

  useEffect(() => {
    setSavedData(getStoredData());

    const handleSync = () => {
      setSavedData(getStoredData());
    };

    window.addEventListener("pulseai_bookmarks_changed", handleSync);
    window.addEventListener("storage", handleSync);
    return () => {
      window.removeEventListener("pulseai_bookmarks_changed", handleSync);
      window.removeEventListener("storage", handleSync);
    };
  }, []);

  const toggleToolBookmark = (slug: string) => {
    const current = getStoredData();
    const exists = current.toolSlugs.includes(slug);
    const updatedSlugs = exists
      ? current.toolSlugs.filter((s) => s !== slug)
      : [...current.toolSlugs, slug];

    const updated = { ...current, toolSlugs: updatedSlugs };
    setStoredData(updated);
    setSavedData(updated);
    return !exists;
  };

  const toggleArticleBookmark = (id: number) => {
    const current = getStoredData();
    const exists = current.articleIds.includes(id);
    const updatedIds = exists
      ? current.articleIds.filter((i) => i !== id)
      : [...current.articleIds, id];

    const updated = { ...current, articleIds: updatedIds };
    setStoredData(updated);
    setSavedData(updated);
    return !exists;
  };

  const isToolSaved = (slug: string) => savedData.toolSlugs.includes(slug);
  const isArticleSaved = (id: number) => savedData.articleIds.includes(id);

  const clearAllBookmarks = () => {
    const empty = { toolSlugs: [], articleIds: [] };
    setStoredData(empty);
    setSavedData(empty);
  };

  return {
    savedToolSlugs: savedData.toolSlugs,
    savedArticleIds: savedData.articleIds,
    savedCount: savedData.toolSlugs.length + savedData.articleIds.length,
    toggleToolBookmark,
    toggleArticleBookmark,
    isToolSaved,
    isArticleSaved,
    clearAllBookmarks,
  };
}
