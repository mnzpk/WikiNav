from flask import Flask, request, abort
from flask_caching import Cache
from contextlib import closing
from flask_cors import CORS
import os
import sqlite3
import pandas as pd

app = Flask(__name__,
            static_url_path='',
            static_folder='client')
CORS(app)
cache = Cache(
    app,
    config={'CACHE_TYPE': 'RedisCache',
            'CACHE_REDIS_HOST': 'tools-redis',
            'CACHE_KEY_PREFIX': 'wn-api-test'}
)

LANGUAGES = ('pt', 'en')


@app.route('/')
def index():
    return app.send_static_file('index.html')


@app.route('/<language>/<title>/<any("sources", "destinations"):direction>')
def main(language, title, direction):
    if language not in LANGUAGES:
        abort(404)
    start = request.args.get('start', 1, type=int)
    limit = request.args.get('limit', 20, type=int)
    sort = request.args.get('sort', 'desc')
    df = get_clickstream_data(language, title)
    if direction == 'sources':
        df = df[df.curr == title][['prev', 'n']]
    else:
        df = df[df.prev == title][['curr', 'n']]
    df.columns = ['title', 'views']
    df.sort_values(by='views', ascending=sort == 'asc', inplace=True)
    return get_paginated_response(df, start, limit, title, request.base_url, sort)


def get_paginated_response(df, start, limit, title, url, sort):
    if start > len(df):
        abort(404)
    results = df.iloc[start-1:start+limit-1]
    if start + limit > len(df):
        next = ''
    else:
        next = f'{url}?start={start+limit}&limit={limit}&sort={sort}'
    res = {
        'title': title,
        'results': results.to_dict('records'),
        'next': next
    }
    return res


@cache.memoize(timeout=60*60*24)
def get_clickstream_data(language, title):
    with closing(connect_db(language)) as conn:
        query = "SELECT * FROM clickstream WHERE prev=:title OR curr=:title"
        df = pd.read_sql_query(query, conn, params={"title": title})
    return df


def connect_db(language):
    database = os.path.join(app.root_path, 'db', f'clickstream_{language}.db')
    return sqlite3.connect(database)
