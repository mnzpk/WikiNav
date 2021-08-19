import os

from . import app, db
from .settings import DB_DIR, DUMPS, LATEST_MONTH, LATEST_MONTH_LANGUAGES
from flask import request, abort, make_response


@app.route("/api/v1/latest/meta")
def get_latest_metadata():
    return {"month": LATEST_MONTH, "languages": LATEST_MONTH_LANGUAGES}


@app.route(
    "/api/v1/<language>/<title>/<any('sources', 'destinations'):direction>/<month>"
)
@app.route(
    "/api/v1/<language>/<title>/<any('sources', 'destinations'):direction>/latest",
    defaults={"month": LATEST_MONTH},
)
def get_clickstream(language, title, direction, month):
    dump = get_dump_name(language, month)
    if dump not in DUMPS:
        abort(404)

    clickstream_data = read_clickstream_data(month, dump, title, direction)
    return get_paginated_response(clickstream_data, title, month)


def get_paginated_response(clickstream_data, title, month):
    start = request.args.get("start", 1, type=int)
    limit = request.args.get("limit", 20, type=int)
    sort = request.args.get("sort", "desc")
    url = request.base_url
    total_count = len(clickstream_data)

    if start > total_count:
        abort(404)

    clickstream_data.sort(key=lambda c: c[1], reverse=sort != "asc")
    results = clickstream_data[start - 1 : start + limit - 1]
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
            "month": month,
            "results": [{"title": title, "views": views} for title, views in results],
            "next": next,
        }
    )

    # makes it possible to get just the count through a HEAD request
    res.headers["Total-Count"] = total_count
    return res


def get_dump_name(language, month):
    dump_name = f"clickstream-{language}wiki-{month}.db"
    return dump_name


def read_clickstream_data(month, dump, title, direction):
    dump_path = os.path.join(DB_DIR, month, dump)
    conn = db.get_db(dump_path)
    cursor = conn.cursor()
    if direction == "sources":
        query = "SELECT prev, n FROM clickstream WHERE curr=?"
    else:
        query = "SELECT curr, n FROM clickstream WHERE prev=?"
    results = cursor.execute(query, (title,)).fetchall()
    return results
