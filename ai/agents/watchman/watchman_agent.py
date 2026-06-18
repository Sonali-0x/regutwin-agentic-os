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

        import uuid
        import os
        filename = os.path.basename(file_path)
        fake_id = str(uuid.uuid4())
        
        # In a real scenario, we'd probably call the backend to create the record first,
        # but for this script, we can run the flow directly
        run_regulation_flow(regulation_id=fake_id, text=text, title=filename, source="Local FileWatcher")

    @staticmethod
    def start():

        watcher = (
            LocalWatcher(
                folder="../backend/src/uploads/regulations",
                callback=WatchmanAgent.process_pdf
            )
        )

        watcher.start()