from flask import Flask
from flask_cors import CORS

app = Flask(__name__)

app.config["CORS_EXPOSE_HEADERS"] = "Total-Count"
CORS(app)

from . import db
db.init_app(app)

from . import api   # noqa F401
