"""Send JSON files from incoming/ to the local API."""

import json
import time
from pathlib import Path
from threading import Event

import requests
from watchdog.events import FileSystemEventHandler
from watchdog.observers import Observer


ROOT = Path(__file__).resolve().parent
WATCH_FOLDER = ROOT / "incoming"
API_URL = "http://127.0.0.1:8000/api/news/"
changed = Event()


class NewFileHandler(FileSystemEventHandler):
    def on_created(self, event):
        if not event.is_directory and event.src_path.lower().endswith(".json"):
            changed.set()

    def on_moved(self, event):
        if not event.is_directory and event.dest_path.lower().endswith(".json"):
            changed.set()


def process_file(path: Path) -> None:
    try:
        before = path.stat()
        time.sleep(0.5)  # A synced file may still be in the middle of a write.
        if path.stat().st_size != before.st_size or path.stat().st_mtime_ns != before.st_mtime_ns:
            return

        with path.open("r", encoding="utf-8") as file:
            articles = json.load(file)
        if not isinstance(articles, list) or not articles:
            raise ValueError("JSON must contain a non-empty list of articles")
        read_stat = path.stat()
        if (read_stat.st_size, read_stat.st_mtime_ns) != (before.st_size, before.st_mtime_ns):
            return

        response = requests.post(API_URL, json=articles, timeout=10)
        response.raise_for_status()
        saved = response.json()["saved"]
        current = path.stat()
        if (current.st_size, current.st_mtime_ns) != (before.st_size, before.st_mtime_ns):
            return  # A writer changed the file; retry its latest contents.
        path.unlink()  # Remove only after the API confirms the database write.
        print(f"Saved {saved} new articles from {path.name}.")
    except (OSError, ValueError, requests.RequestException, KeyError) as exc:
        print(f"Could not process {path.name}: {exc}. The file remains for retry.")


def main() -> None:
    WATCH_FOLDER.mkdir(exist_ok=True)
    observer = Observer()
    observer.schedule(NewFileHandler(), str(WATCH_FOLDER), recursive=False)
    observer.start()
    print(f"Watching {WATCH_FOLDER}. Press Ctrl+C to stop.")
    try:
        while True:
            # Scanning also catches files that arrived while this script was stopped.
            for path in sorted(WATCH_FOLDER.glob("*.json")):
                process_file(path)
            changed.wait(timeout=5)
            changed.clear()
    except KeyboardInterrupt:
        print("Stopping watcher.")
    finally:
        observer.stop()
        observer.join()


if __name__ == "__main__":
    main()
