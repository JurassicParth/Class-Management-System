from flask import Blueprint, jsonify, request
import re
from database.db import connection, cursor

students_bp = Blueprint("students", __name__)

# 1. GET ALL STUDENTS
@students_bp.route("/students", methods=["GET"])
def get_students():
    try:
        # Re-verify database connection status
        connection.ping(reconnect=True)
        cursor.execute("SELECT * FROM students")
        students = cursor.fetchall()
        print("Students Found:", students)
        return jsonify(students), 200
    except Exception as e:
        print("Error fetching students:", str(e))
        return jsonify({"error": "Failed to fetch students from database"}), 500

# 2. ADD A NEW STUDENT (WITH 'CA' + 3 DIGITS VALIDATION)
@students_bp.route("/students", methods=["POST", "OPTIONS"])
def add_student():
    if request.method == "OPTIONS":
        return jsonify({"status": "OK"}), 200

    try:
        connection.ping(reconnect=True)
        data = request.get_json()
        
        student_id = data.get("id")        # e.g., CA101
        name = data.get("name")
        student_class = data.get("class")
        email = data.get("email")

        # Validation logic: Ensure the ID matches exactly 'CA' followed by 3 digits
        if not student_id or not re.match(r"^CA\d{3}$", student_id):
            return jsonify({"error": "Invalid Student ID format. Must be 'CA' followed by exactly 3 digits (e.g., CA101)."}), 400

        if not name or not student_class or not email:
            return jsonify({"error": "All fields are required"}), 400

        query = "INSERT INTO students (id, name, class, email) VALUES (%s, %s, %s, %s)"
        cursor.execute(query, (student_id, name, student_class, email))
        connection.commit()

        return jsonify({"message": "Student added successfully!"}), 201
    except Exception as e:
        print("Error adding student:", str(e))
        return jsonify({"error": "Failed to add student to database"}), 500

# 3. UPDATE AN EXISTING STUDENT
@students_bp.route("/students/<string:student_id>", methods=["PUT", "OPTIONS"])
def update_student(student_id):
    if request.method == "OPTIONS":
        return jsonify({"status": "OK"}), 200

    try:
        connection.ping(reconnect=True)
        data = request.get_json()
        name = data.get("name")
        student_class = data.get("class")
        email = data.get("email")

        if not name or not student_class or not email:
            return jsonify({"error": "All fields are required"}), 400

        query = "UPDATE students SET name = %s, class = %s, email = %s WHERE id = %s"
        cursor.execute(query, (name, student_class, email, student_id))
        connection.commit()

        return jsonify({"message": "Student updated successfully!"}), 200
    except Exception as e:
        print("Error updating student:", str(e))
        return jsonify({"error": "Failed to update student"}), 500

# 4. DELETE A STUDENT
@students_bp.route("/students/<string:student_id>", methods=["DELETE", "OPTIONS"])
def delete_student(student_id):
    if request.method == "OPTIONS":
        return jsonify({"status": "OK"}), 200

    try:
        connection.ping(reconnect=True)
        query = "DELETE FROM students WHERE id = %s"
        cursor.execute(query, (student_id,))
        connection.commit()

        return jsonify({"message": "Student deleted successfully!"}), 200
    except Exception as e:
        print("Error deleting student:", str(e))
        return jsonify({"error": "Failed to delete student"}), 500
