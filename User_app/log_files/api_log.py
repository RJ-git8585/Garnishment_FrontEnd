# User_app/utils.py

from ..models import Logdata

def log_api(api_name, endpoint, status_code, message, status):
    Logdata.objects.create(
        api_name=api_name,
        endpoint=endpoint,
        status_code=status_code,
        message=message,
        status=status
    )
