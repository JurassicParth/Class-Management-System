from flask import Flask
from flask_cors import CORS

from routes.students import students_bp

app = Flask(__name__)

# This broad setup allows all methods (GET, POST, OPTIONS) and headers from any local origin
CORS(app, resources={r"/*": {"origins": "*"}}, supports_credentials=True)

app.register_blueprint(students_bp)

@app.route("/")
def home():
    return {
        "message": "CMS Backend Running"
    }

if __name__ == "__main__":
    app.run(debug=True, port=8080)
