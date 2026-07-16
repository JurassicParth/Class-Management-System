from flask import Blueprint, request, jsonify
from database.db import get_db_connection

teachers_bp = Blueprint("teachers", __name__)


# ======================================
# GET ALL TEACHERS
# ======================================

@teachers_bp.route("/teachers", methods=["GET"])
def get_teachers():

    connection = get_db_connection()

    if connection is None:
        return jsonify({
            "success": False,
            "message": "Database Connection Failed."
        }), 500

    cursor = connection.cursor(dictionary=True)

    query = """
        SELECT *
        FROM teachers
        ORDER BY id ASC
    """

    cursor.execute(query)

    teachers = cursor.fetchall()

    cursor.close()
    connection.close()

    return jsonify(teachers)


# ======================================
# GET TEACHER BY ID
# ======================================

@teachers_bp.route("/teachers/<int:id>", methods=["GET"])
def get_teacher(id):

    connection = get_db_connection()

    if connection is None:
        return jsonify({
            "success": False,
            "message": "Database Connection Failed."
        }), 500

    cursor = connection.cursor(dictionary=True)

    query = """
        SELECT *
        FROM teachers
        WHERE id = %s
    """

    cursor.execute(query, (id,))

    teacher = cursor.fetchone()

    cursor.close()
    connection.close()

    if teacher:
        return jsonify(teacher)

    return jsonify({
        "success": False,
        "message": "Teacher Not Found."
    }), 404


# ======================================
# ADD NEW TEACHER
# ======================================

@teachers_bp.route("/teachers", methods=["POST"])
def add_teacher():

    data = request.get_json()

    teacher_id = data.get("teacher_id", "").strip()
    name = data.get("name", "").strip()
    subject = data.get("subject", "").strip()
    email = data.get("email", "").strip()

    if teacher_id == "" or name == "" or subject == "" or email == "":

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
        INSERT INTO teachers
        (
            teacher_id,
            name,
            subject,
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
            teacher_id,
            name,
            subject,
            email
        )
    )

    connection.commit()

    cursor.close()
    connection.close()

    return jsonify({
        "success": True,
        "message": "Teacher Added Successfully."
    }), 201


# ======================================
# UPDATE TEACHER
# ======================================

@teachers_bp.route("/teachers/<int:id>", methods=["PUT"])
def update_teacher(id):

    data = request.get_json()

    teacher_id = data.get("teacher_id", "").strip()
    name = data.get("name", "").strip()
    subject = data.get("subject", "").strip()
    email = data.get("email", "").strip()

    connection = get_db_connection()

    if connection is None:

        return jsonify({
            "success": False,
            "message": "Database Connection Failed."
        }), 500

    cursor = connection.cursor()

    query = """
        UPDATE teachers
        SET
            teacher_id = %s,
            name = %s,
            subject = %s,
            email = %s
        WHERE id = %s
    """

    cursor.execute(
        query,
        (
            teacher_id,
            name,
            subject,
            email,
            id
        )
    )

    connection.commit()

    cursor.close()
    connection.close()

    return jsonify({
        "success": True,
        "message": "Teacher Updated Successfully."
    })


# ======================================
# DELETE TEACHER
# ======================================

@teachers_bp.route("/teachers/<int:id>", methods=["DELETE"])
def delete_teacher(id):

    connection = get_db_connection()

    if connection is None:

        return jsonify({
            "success": False,
            "message": "Database Connection Failed."
        }), 500

    cursor = connection.cursor()

    query = """
        DELETE FROM teachers
        WHERE id = %s
    """

    cursor.execute(query, (id,))

    connection.commit()

    cursor.close()
    connection.close()

    return jsonify({
        "success": True,
        "message": "Teacher Deleted Successfully."
    })


# ======================================
# SEARCH TEACHER
# ======================================

@teachers_bp.route("/teachers/search/<string:keyword>", methods=["GET"])
def search_teacher(keyword):

    connection = get_db_connection()

    if connection is None:

        return jsonify({
            "success": False,
            "message": "Database Connection Failed."
        }), 500

    cursor = connection.cursor(dictionary=True)

    value = "%" + keyword + "%"

    query = """
        SELECT *
        FROM teachers
        WHERE
            teacher_id LIKE %s
            OR name LIKE %s
            OR subject LIKE %s
            OR email LIKE %s
        ORDER BY id ASC
    """

    cursor.execute(
        query,
        (
            value,
            value,
            value,
            value
        )
    )

    teachers = cursor.fetchall()

    cursor.close()
    connection.close()

    return jsonify(teachers)