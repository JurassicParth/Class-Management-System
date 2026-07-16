from flask import Flask, jsonify
from flask_cors import CORS

# Database
from database.db import get_db_connection

# Import Blueprints
from routes.auth import auth_bp
from routes.students import students_bp
from routes.teachers import teachers_bp
from routes.courses import courses_bp
from routes.attendance import attendance_bp
from routes.marks import marks_bp
from routes.announcements import announcements_bp

# Create Flask App
app = Flask(__name__)

# Enable CORS
CORS(app)


# ======================================
# HOME ROUTE
# ======================================

@app.route("/", methods=["GET"])
def home():

    return jsonify({
        "success": True,
        "message": "Welcome to the College Management System API"
    })


# ======================================
# DATABASE TEST ROUTE
# ======================================

@app.route("/db-test", methods=["GET"])
def db_test():

    connection = get_db_connection()

    if connection is None:
        return jsonify({
            "success": False,
            "message": "Database Connection Failed."
        }), 500

    connection.close()

    return jsonify({
        "success": True,
        "message": "Database Connected Successfully."
    })


# ======================================
# REGISTER BLUEPRINTS
# ======================================

app.register_blueprint(auth_bp)
app.register_blueprint(students_bp)
app.register_blueprint(teachers_bp)
app.register_blueprint(courses_bp)
app.register_blueprint(attendance_bp)
app.register_blueprint(marks_bp)
app.register_blueprint(announcements_bp)


# ======================================
# RUN APPLICATION
# ======================================

if __name__ == "__main__":
    app.run(
        host="127.0.0.1",
        port=5000,
        debug=True
    )