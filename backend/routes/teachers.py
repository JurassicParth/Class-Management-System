from flask import Blueprint, jsonify, request
from database.db import connection, cursor

teachers_bp = Blueprint("teachers", __name__)

# 1. GET ALL TEACHERS
@teachers_bp.route("/teachers", methods=["GET"])
def get_teachers():
    try:
        connection.ping(reconnect=True)
        # Select teacher_id and alias it as id for the client app
        cursor.execute("SELECT teacher_id AS id, name, subject, email FROM teachers")
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
        
        id_val = data.get("id")
        name_val = data.get("name")
        subject_val = data.get("subject")
        email_val = data.get("email")

        if not id_val or not name_val or not subject_val or not email_val:
            return jsonify({"error": "All fields are required"}), 400

        # Aligns with your column name: teacher_id
        query = "INSERT INTO teachers (teacher_id, name, subject, email) VALUES (%s, %s, %s, %s)"
        cursor.execute(query, (id_val, name_val, subject_val, email_val))
        connection.commit()

        return jsonify({"message": "Teacher added successfully!"}), 201
    except Exception as e:
        print("Database Write Error details:", str(e))
        return jsonify({"error": f"Database Insertion Failure: {str(e)}"}), 500

# 3. UPDATE AN EXISTING TEACHER
@teachers_bp.route("/teachers/<string:target_id>", methods=["PUT", "OPTIONS"])
def update_teacher(target_id):
    if request.method == "OPTIONS":
        return jsonify({"status": "OK"}), 200

    try:
        connection.ping(reconnect=True)
        data = request.get_json()
        name_val = data.get("name")
        subject_val = data.get("subject")
        email_val = data.get("email")

        if not name_val or not subject_val or not email_val:
            return jsonify({"error": "All fields are required"}), 400

        query = "UPDATE teachers SET name = %s, subject = %s, email = %s WHERE teacher_id = %s"
        cursor.execute(query, (name_val, subject_val, email_val, target_id))
        connection.commit()

        return jsonify({"message": "Teacher updated successfully!"}), 200
    except Exception as e:
        print("Error updating teacher:", str(e))
        return jsonify({"error": "Failed to update teacher"}), 500

# 4. DELETE A TEACHER
@teachers_bp.route("/teachers/<string:target_id>", methods=["DELETE", "OPTIONS"])
def delete_teacher(target_id):
    if request.method == "OPTIONS":
        return jsonify({"status": "OK"}), 200

    try:
        connection.ping(reconnect=True)
        query = "DELETE FROM teachers WHERE teacher_id = %s"
        cursor.execute(query, (target_id,))
        connection.commit()

        return jsonify({"message": "Teacher deleted successfully!"}), 200
    except Exception as e:
        print("Error deleting teacher:", str(e))
        return jsonify({"error": "Failed to delete teacher"}), 500
