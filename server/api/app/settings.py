import os
import glob

APP_ROOT = os.path.dirname(os.path.abspath(__file__))
DB_DIR = os.path.join(os.path.dirname(APP_ROOT), "db")

# latest month directory in DB_DIR
LATEST_MONTH = max((d for d in os.listdir(DB_DIR)))

# recursively get all sqlite dumps from every month directory in DB_DIR
DUMPS = [os.path.basename(f) for f in glob.iglob(os.path.join(DB_DIR, "**", "*.db"))]

# get all languages available in LATEST_MONTH
LATEST_MONTH_LANGUAGES = [
    f.split("-")[1].replace("wiki", "")
    for f in os.listdir(os.path.join(DB_DIR, LATEST_MONTH))
]
