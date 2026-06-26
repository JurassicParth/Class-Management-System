from flask import Flask, request, jsonify
from flask_cors import CORS
import mysql.connector

# Import shared database connection and all route blueprints
from database.db import connection, cursor
from routes.students import students_bp
from routes.teachers import teachers_bp
from routes.dashboard import dashboard_bp  # Imported new route tracker

app = Flask(__name__)

# Broad safety configurations for client requests
CORS(app, resources={r"/*": {"origins": "*"}}, supports_credentials=True)

# Registering blueprints
app.register_blueprint(students_bp)
app.register_blueprint(teachers_bp)
app.register_blueprint(dashboard_bp)  # Active blueprint tracker

@app.route("/")
def home():
    return {
        "message": "CMS Backend Running"
    }

@app.route('/api/login', methods=['POST', 'OPTIONS'])
def login():
    if request.method == 'OPTIONS':
        return jsonify({"status": "OK"}), 200
        
    data = request.get_json()
    username = data.get('username')
    password = data.get('password')

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
