from flask import g
import sqlite3


def get_db(db_path):
    if "db" not in g:
        g.db = sqlite3.connect(db_path)

    return g.db


def close_db(e=None):
    db = g.pop("db", None)

    if db is not None:
        db.close()


def init_app(app):
    app.teardown_appcontext(close_db)
