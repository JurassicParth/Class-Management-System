from flask import Flask, request, jsonify
from flask_cors import CORS
import mysql.connector

# Import the shared database objects
from database.db import connection, cursor
from routes.students import students_bp

app = Flask(__name__)

# Broad setup allows all methods (GET, POST, OPTIONS) and headers from any local origin
CORS(app, resources={r"/*": {"origins": "*"}}, supports_credentials=True)

# Registering your external blueprint route modules
app.register_blueprint(students_bp)

@app.route("/")
def home():
    return {
        "message": "CMS Backend Running"
    }

@app.route('/api/login', methods=['POST', 'OPTIONS'])
def login():
    # Handle the browser's automatic preflight safety check
    if request.method == 'OPTIONS':
        return jsonify({"status": "OK"}), 200
        
    data = request.get_json()
    username = data.get('username')
    password = data.get('password')

    # Query the admins table using our unified cursor
    query = "SELECT * FROM admins WHERE username = %s AND password_hash = %s"
    cursor.execute(query, (username, password))
    admin = cursor.fetchone()

    if admin:
        return jsonify({
            "message": "Login successful!", 
            "user": admin["full_name"]
        }), 200
    else:
        return jsonify({"error": "Invalid username or password"}), 401

if __name__ == "__main__":
    app.run(debug=True, port=8080)
