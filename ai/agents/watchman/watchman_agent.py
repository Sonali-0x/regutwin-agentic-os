from agents.watchman.local_watcher import (
    LocalWatcher
)

from workflows.regulation_flow import (
    run_regulation_flow
)

from services.pdf_service import (
    extract_text
)


class WatchmanAgent:

    @staticmethod
    def process_pdf(file_path: str):

        print("New PDF:", file_path)

        text = extract_text(file_path)

        run_regulation_flow(text)

    @staticmethod
    def start():

        watcher = (
            LocalWatcher(
                folder="../backend/src/uploads/regulations",
                callback=WatchmanAgent.process_pdf
            )
        )

        watcher.start()