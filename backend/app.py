from flask import Flask, request, jsonify
from flask_cors import CORS
import mysql.connector

from routes.students import students_bp

app = Flask(__name__)

# This broad setup allows all methods (GET, POST, OPTIONS) and headers from any local origin
CORS(app, resources={r"/*": {"origins": "*"}}, supports_credentials=True)

# 1. Add your MySQL Database Connection here
db = mysql.connector.connect(
    host="localhost",
    user="root",         # Change if your MySQL username is different
    password="success@7",         # Put your MySQL password inside the quotes
    database="cms_db"    # Make sure this matches your database name
)

app.register_blueprint(students_bp)

@app.route("/")
def home():
    return {
        "message": "CMS Backend Running"
    }

# 2. Add the missing Login Route right here
@app.route('/api/login', methods=['POST', 'OPTIONS'])
def login():
    if request.method == 'OPTIONS':
        return jsonify({"status": "OK"}), 200
        
    data = request.get_json()
    username = data.get('username')
    password = data.get('password')

    cursor = db.cursor(dictionary=True)
    # Checks the admins table for a matching username and password
    cursor.execute("SELECT * FROM admins WHERE username = %s AND password_hash = %s", (username, password))
    admin = cursor.fetchone()
    cursor.close()

    if admin:
        return jsonify({"message": "Login successful!", "user": admin["full_name"]}), 200
    else:
        return jsonify({"error": "Invalid username or password"}), 401

if __name__ == "__main__":
    app.run(debug=True, port=8080)
