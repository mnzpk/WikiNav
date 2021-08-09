import glob
import os
import pandas as pd

from . import app, db
from .settings import DB_DIR, LATEST_MONTH
from flask import request, abort, make_response


# recursively get all sqlite dumps from every month directory in DB_DIR
DUMPS = [
    os.path.basename(f)
    for f in glob.iglob(os.path.join(DB_DIR, "**", "*.db"))
]

# get all languages available in LATEST_MONTH
LATEST_MONTH_LANGUAGES = [
    f.split("-")[1].replace("wiki", "")
    for f in os.listdir(os.path.join(DB_DIR, LATEST_MONTH))
]


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

    df = read_clickstream_data(month, dump, title, direction)
    df.columns = ["title", "views"]
    return get_paginated_response(df, title, month)


@app.route("/api/v1/latest/meta")
def get_latest_metadata():
    return {"month": LATEST_MONTH, "languages": LATEST_MONTH_LANGUAGES}


def get_paginated_response(df, title, month):
    start = request.args.get("start", 1, type=int)
    limit = request.args.get("limit", 20, type=int)
    sort = request.args.get("sort", "desc")
    url = request.base_url
    total_count = len(df)

    if start > total_count:
        abort(404)

    df.sort_values(by="views", ascending=sort == "asc", inplace=True)
    results = df.iloc[start - 1 : start + limit - 1]  # noqa E203
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
            "results": results.to_dict("records"),
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
    if direction == "sources":
        query = "SELECT prev, n FROM clickstream WHERE curr=:title"
    else:
        query = "SELECT curr, n FROM clickstream WHERE prev=:title"
    df = pd.read_sql_query(query, conn, params={"title": title})
    return df
