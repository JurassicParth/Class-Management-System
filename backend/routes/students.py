from flask import Blueprint, request, jsonify
from database.db import get_db_connection

students_bp = Blueprint("students", __name__)


# ======================================
# GET ALL STUDENTS
# ======================================

@students_bp.route("/students", methods=["GET"])
def get_students():

    connection = get_db_connection()

    if connection is None:
        return jsonify({
            "success": False,
            "message": "Database Connection Failed."
        }), 500

    cursor = connection.cursor(dictionary=True)

    query = """
        SELECT *
        FROM students
        ORDER BY id ASC
    """

    cursor.execute(query)

    students = cursor.fetchall()

    cursor.close()
    connection.close()

    return jsonify(students)


# ======================================
# GET STUDENT BY ID
# ======================================

@students_bp.route("/students/<int:id>", methods=["GET"])
def get_student(id):

    connection = get_db_connection()

    if connection is None:
        return jsonify({
            "success": False,
            "message": "Database Connection Failed."
        }), 500

    cursor = connection.cursor(dictionary=True)

    query = """
        SELECT *
        FROM students
        WHERE id = %s
    """

    cursor.execute(query, (id,))

    student = cursor.fetchone()

    cursor.close()
    connection.close()

    if student:

        return jsonify(student)

    return jsonify({
        "success": False,
        "message": "Student Not Found."
    }), 404


# ======================================
# ADD NEW STUDENT
# ======================================

@students_bp.route("/students", methods=["POST"])
def add_student():

    data = request.get_json()

    student_id = data.get("student_id", "").strip()
    name = data.get("name", "").strip()
    class_name = data.get("class_name", "").strip()
    email = data.get("email", "").strip()

    if student_id == "" or name == "" or class_name == "" or email == "":

        return jsonify({
            "success": False,
            "message": "Please fill all fields."
        }), 400

    connection = get_db_connection()

    if connection is None:

        return jsonify({
            "success": False,
            "message": "Database Connection Failed."
        }), 500

    cursor = connection.cursor()

    query = """
        INSERT INTO students
        (
            student_id,
            name,
            class_name,
            email
        )
        VALUES
        (
            %s,
            %s,
            %s,
            %s
        )
    """

    cursor.execute(
        query,
        (
            student_id,
            name,
            class_name,
            email
        )
    )

    connection.commit()

    cursor.close()
    connection.close()

    return jsonify({
        "success": True,
        "message": "Student Added Successfully."
    }), 201


# ======================================
# UPDATE STUDENT
# ======================================

@students_bp.route("/students/<int:id>", methods=["PUT"])
def update_student(id):

    data = request.get_json()

    student_id = data.get("student_id", "").strip()
    name = data.get("name", "").strip()
    class_name = data.get("class_name", "").strip()
    email = data.get("email", "").strip()

    connection = get_db_connection()

    if connection is None:

        return jsonify({
            "success": False,
            "message": "Database Connection Failed."
        }), 500

    cursor = connection.cursor()

    query = """
        UPDATE students
        SET
            student_id = %s,
            name = %s,
            class_name = %s,
            email = %s
        WHERE id = %s
    """

    cursor.execute(
        query,
        (
            student_id,
            name,
            class_name,
            email,
            id
        )
    )

    connection.commit()

    cursor.close()
    connection.close()

    return jsonify({
        "success": True,
        "message": "Student Updated Successfully."
    })


# ======================================
# DELETE STUDENT
# ======================================

@students_bp.route("/students/<int:id>", methods=["DELETE"])
def delete_student(id):

    connection = get_db_connection()

    if connection is None:

        return jsonify({
            "success": False,
            "message": "Database Connection Failed."
        }), 500

    cursor = connection.cursor()

    query = """
        DELETE FROM students
        WHERE id = %s
    """

    cursor.execute(query, (id,))

    connection.commit()

    cursor.close()
    connection.close()

    return jsonify({
        "success": True,
        "message": "Student Deleted Successfully."
    })


# ======================================
# SEARCH STUDENT
# ======================================

@students_bp.route("/students/search/<string:keyword>", methods=["GET"])
def search_student(keyword):

    connection = get_db_connection()

    if connection is None:

        return jsonify({
            "success": False,
            "message": "Database Connection Failed."
        }), 500

    cursor = connection.cursor(dictionary=True)

    query = """
        SELECT *
        FROM students
        WHERE
            student_id LIKE %s
            OR name LIKE %s
            OR class_name LIKE %s
            OR email LIKE %s
        ORDER BY id ASC
    """

    value = "%" + keyword + "%"

    cursor.execute(
        query,
        (
            value,
            value,
            value,
            value
        )
    )

    students = cursor.fetchall()

    cursor.close()
    connection.close()

    return jsonify(students)