from flask import Flask

app = Flask(__name__, static_url_path="", static_folder="build")


@app.route("/")
def index():
    return app.send_static_file("index.html")
