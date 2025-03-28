import logging
import traceback
from django.utils.module_loading import import_string

from User_app.models import LogEntry


class DatabaseHandler(logging.Handler):
    def emit(self, record):
        try:
            print(f"Logging to database: {record.levelname} - {record.getMessage()}")  # Debug print

            LogEntry.objects.create(
                level=record.levelname,
                message=record.getMessage(),
                timestamp=record.created,
                logger_name=record.name,
                file_name=record.pathname,
                line_number=record.lineno,
                function_name=record.funcName,
                traceback=traceback.format_exc() if record.exc_info else None
            )

            print("Log successfully saved to database.")  # Confirm insertion
        except Exception as e:
            print(f"Logging to database failed: {e}")  # Print any error
