from watchdog.observers import Observer
from watchdog.events import FileSystemEventHandler
import time

class PDFHandler(FileSystemEventHandler):
    def __init__(self, callback):
        self.callback = callback

    def on_created(self, event):
        if (
            not event.is_directory
            and event.src_path.endswith(".pdf")
        ):
            self.callback(
                event.src_path
            )


class LocalWatcher:

    def __init__(
        self,
        folder: str,
        callback
    ):
        self.folder = folder
        self.callback = callback

    def start(self):
        observer = Observer()

        observer.schedule(
            PDFHandler(
                self.callback
            ),
            self.folder,
            recursive=False
        )

        observer.start()

        print(f"Watching {self.folder}")

        try:
            while True:
                time.sleep(1)

        except KeyboardInterrupt:
            observer.stop()

        observer.join()