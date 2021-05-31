from flask import Flask, make_response
from contextlib import closing
import os
import sqlite3
import pandas as pd

app = Flask(__name__)

LANGUAGES = ('pt')

@app.route('/<language>/<title>')
def get_sources_and_destinations(language, title):
    if language not in LANGUAGES:
        return custom_error({'error': 'unsupported language'}, 404)

    with closing(connect_db(language)) as conn:
        query = "SELECT * FROM clickstream WHERE prev=:title OR curr=:title"
        df = pd.read_sql_query(query, conn, params={"title":title})

    sources = df[df.curr == title][['prev', 'n']]
    sources.columns = ['title', 'views']
    destinations = df[df.prev == title][['curr', 'n']]
    destinations.columns = ['title', 'views']

    res = {
        'title': title,
        'sources': sources.to_dict('records'),
        'destinations': destinations.to_dict('records'),
    }

    return res

def connect_db(language):
    database = os.path.join(app.root_path, 'db', f'clickstream_{language}.db')
    return sqlite3.connect(database)

def custom_error(message, status_code):
    return make_response(message, status_code)
