import os
import pandas as pd
import sqlite3

from contextlib import closing
from flask import Flask, request, abort, make_response
from flask_cors import CORS

app = Flask(__name__, static_url_path="", static_folder="client")

app.config["CORS_EXPOSE_HEADERS"] = "Total-Count"
CORS(app)

DUMPS = [f for f in os.listdir(os.path.join(app.root_path, "db")) if f.endswith(".db")]


@app.route(
    "/api/v1/<language>/<title>/<any('sources', 'destinations'):direction>/<month>"
)
def main(language, title, direction, month):
    dump = get_dump_name(language, month)
    if dump not in DUMPS:
        abort(404)

    start = request.args.get("start", 1, type=int)
    limit = request.args.get("limit", 20, type=int)
    sort = request.args.get("sort", "desc")
    df = get_clickstream_data(dump, title)
    if direction == "sources":
        df = df[df.curr == title][["prev", "n"]]
    else:
        df = df[df.prev == title][["curr", "n"]]
    df.columns = ["title", "views"]
    df.sort_values(by="views", ascending=sort == "asc", inplace=True)
    return get_paginated_response(df, start, limit, title, request.base_url, sort)


def get_paginated_response(df, start, limit, title, url, sort):
    total_count = len(df)
    if start > total_count:
        abort(404)
    results = df.iloc[start - 1 : start + limit - 1]
    if start + limit > total_count:
        next = ""
    else:
        next = f"{url}?start={start+limit}&limit={limit}&sort={sort}"
    res = make_response(
        {
            "start": start,
            "limit": limit,
            "sort": sort,
            "total_count": total_count,
            "title": title,
            "results": results.to_dict("records"),
            "next": next,
        }
    )

    # makes it possible to get just the count through a HEAD request
    res.headers["Total-Count"] = total_count
    return res


def get_dump_name(language, month):
    dump_name = f"clickstream-{language}wiki-{month[:-2]}-{month[-2:]}.db"
    return dump_name


def get_clickstream_data(dump, title):
    with closing(connect_db(dump)) as conn:
        query = "SELECT * FROM clickstream WHERE prev=:title OR curr=:title"
        df = pd.read_sql_query(query, conn, params={"title": title})
        return df


def connect_db(dump):
    database = os.path.join(app.root_path, "db", dump)
    return sqlite3.connect(database)
