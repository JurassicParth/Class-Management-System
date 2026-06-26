from flask import Blueprint, jsonify, request
import re
from database.db import connection, cursor

students_bp = Blueprint("students", __name__)

# 1. GET ALL STUDENTS
@students_bp.route("/students", methods=["GET"])
def get_students():
    try:
        connection.ping(reconnect=True)
        # Select from your precise schema
        cursor.execute("SELECT student_id AS id, name, class_name AS class, email FROM students")
        students = cursor.fetchall()
        return jsonify(students), 200
    except Exception as e:
        print("Error fetching students:", str(e))
        return jsonify({"error": "Failed to fetch students from database"}), 500

# 2. ADD A NEW STUDENT
@students_bp.route("/students", methods=["POST", "OPTIONS"])
def add_student():
    if request.method == "OPTIONS":
        return jsonify({"status": "OK"}), 200

    try:
        connection.ping(reconnect=True)
        data = request.get_json()
        
        id_val = data.get("id")        # e.g., CA101
        name_val = data.get("name")
        class_val = data.get("class")
        email_val = data.get("email")

        # Validate your custom SRN format logic (CA + exactly 3 digits)
        if not id_val or not re.match(r"^CA\d{3}$", id_val):
            return jsonify({"error": "Invalid Student ID format. Must be 'CA' followed by exactly 3 digits (e.g., CA101)."}), 400

        if not name_val or not class_val or not email_val:
            return jsonify({"error": "All fields are required"}), 400

        # Aligns perfectly with your column names: student_id and class_name
        query = "INSERT INTO students (student_id, name, class_name, email) VALUES (%s, %s, %s, %s)"
        cursor.execute(query, (id_val, name_val, class_val, email_val))
        connection.commit()

        return jsonify({"message": "Student added successfully!"}), 201
    except Exception as e:
        print("Database Write Error details:", str(e))
        return jsonify({"error": f"Database Insertion Failure: {str(e)}"}), 500

# 3. UPDATE AN EXISTING STUDENT
@students_bp.route("/students/<string:target_id>", methods=["PUT", "OPTIONS"])
def update_student(target_id):
    if request.method == "OPTIONS":
        return jsonify({"status": "OK"}), 200

    try:
        connection.ping(reconnect=True)
        data = request.get_json()
        name_val = data.get("name")
        class_val = data.get("class")
        email_val = data.get("email")

        if not name_val or not class_val or not email_val:
            return jsonify({"error": "All fields are required"}), 400

        query = "UPDATE students SET name = %s, class_name = %s, email = %s WHERE student_id = %s"
        cursor.execute(query, (name_val, class_val, email_val, target_id))
        connection.commit()

        return jsonify({"message": "Student updated successfully!"}), 200
    except Exception as e:
        print("Error updating student:", str(e))
        return jsonify({"error": "Failed to update student"}), 500

# 4. DELETE A STUDENT
@students_bp.route("/students/<string:target_id>", methods=["DELETE", "OPTIONS"])
def delete_student(target_id):
    if request.method == "OPTIONS":
        return jsonify({"status": "OK"}), 200

    try:
        connection.ping(reconnect=True)
        query = "DELETE FROM students WHERE student_id = %s"
        cursor.execute(query, (target_id,))
        connection.commit()

        return jsonify({"message": "Student deleted successfully!"}), 200
    except Exception as e:
        print("Error deleting student:", str(e))
        return jsonify({"error": "Failed to delete student"}), 500
