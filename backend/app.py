from flask import Flask, request, jsonify
from flask_cors import CORS

# Import the unified connection from your db.py file
from db import connection
# Import all route blueprints
from routes.students import students_bp
from routes.teachers import teachers_bp
from routes.dashboard import dashboard_bp

app = Flask(__name__)

# Broad setup allows all methods (GET, POST, PUT, DELETE, OPTIONS) from any local origin
CORS(app, resources={r"/*": {"origins": "*"}}, supports_credentials=True)

# Registering blueprints
app.register_blueprint(students_bp)
app.register_blueprint(teachers_bp)
app.register_blueprint(dashboard_bp)

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

    # Using the shared connection to run the login verification query
    cursor = connection.cursor(dictionary=True)
    query = "SELECT * FROM admins WHERE username = %s AND password_hash = %s"
    cursor.execute(query, (username, password))
    admin = cursor.fetchone()
    cursor.close()

    if admin:
        return jsonify({
            "message": "Login successful!", 
            "user": admin["full_name"]
        }), 200
    else:
        return jsonify({"error": "Invalid username or password"}), 401

if __name__ == "__main__":
    app.run(debug=True, port=8080)
