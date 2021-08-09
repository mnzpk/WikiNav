import os

APP_ROOT = os.path.dirname(os.path.abspath(__file__))
DB_DIR = os.path.join(os.path.dirname(APP_ROOT), "db")

# latest month directory in DB_DIR
LATEST_MONTH = max((d for d in os.listdir(DB_DIR)))
