from flask import Blueprint, jsonify, request
from database.db import connection, cursor

teachers_bp = Blueprint("teachers", __name__)

# 1. GET ALL TEACHERS
@teachers_bp.route("/teachers", methods=["GET"])
def get_teachers():
    try:
        connection.ping(reconnect=True)
        cursor.execute("SELECT * FROM teachers")
        teachers = cursor.fetchall()
        return jsonify(teachers), 200
    except Exception as e:
        print("Error fetching teachers:", str(e))
        return jsonify({"error": "Failed to fetch teachers from database"}), 500

# 2. ADD A NEW TEACHER
@teachers_bp.route("/teachers", methods=["POST", "OPTIONS"])
def add_teacher():
    if request.method == "OPTIONS":
        return jsonify({"status": "OK"}), 200

    try:
        connection.ping(reconnect=True)
        data = request.get_json()
        
        teacher_id = data.get("id")
        name = data.get("name")
        subject = data.get("subject")
        email = data.get("email")

        if not teacher_id or not name or not subject or not email:
            return jsonify({"error": "All fields are required"}), 400

        # Removed password_hash column to match your local MySQL schema columns perfectly
        query = "INSERT INTO teachers (id, name, subject, email) VALUES (%s, %s, %s, %s)"
        cursor.execute(query, (teacher_id, name, subject, email))
        connection.commit()

        return jsonify({"message": "Teacher added successfully!"}), 201
    except Exception as e:
        print("Database Write Error details:", str(e))
        return jsonify({"error": f"Database Insertion Failure: {str(e)}"}), 500

# 3. UPDATE AN EXISTING TEACHER
@teachers_bp.route("/teachers/<string:teacher_id>", methods=["PUT", "OPTIONS"])
def update_teacher(teacher_id):
    if request.method == "OPTIONS":
        return jsonify({"status": "OK"}), 200

    try:
        connection.ping(reconnect=True)
        data = request.get_json()
        name = data.get("name")
        subject = data.get("subject")
        email = data.get("email")

        if not name or not subject or not email:
            return jsonify({"error": "All fields are required"}), 400

        query = "UPDATE teachers SET name = %s, subject = %s, email = %s WHERE id = %s"
        cursor.execute(query, (name, subject, email, teacher_id))
        connection.commit()

        return jsonify({"message": "Teacher updated successfully!"}), 200
    except Exception as e:
        print("Error updating teacher:", str(e))
        return jsonify({"error": "Failed to update teacher"}), 500

# 4. DELETE A TEACHER
@teachers_bp.route("/teachers/<string:teacher_id>", methods=["DELETE", "OPTIONS"])
def delete_teacher(teacher_id):
    if request.method == "OPTIONS":
        return jsonify({"status": "OK"}), 200

    try:
        connection.ping(reconnect=True)
        query = "DELETE FROM teachers WHERE id = %s"
        cursor.execute(query, (teacher_id,))
        connection.commit()

        return jsonify({"message": "Teacher deleted successfully!"}), 200
    except Exception as e:
        print("Error deleting teacher:", str(e))
        return jsonify({"error": "Failed to delete teacher"}), 500
