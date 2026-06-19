from flask import Flask
from flask_cors import CORS

from routes.students import students_bp

app = Flask(__name__)

CORS(app)

app.register_blueprint(students_bp)

@app.route("/")
def home():
    return {
        "message": "CMS Backend Running"
    }

if __name__ == "__main__":
    app.run(debug=True)