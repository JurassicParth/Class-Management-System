from flask import Blueprint, request, jsonify
from database.db import get_db_connection

attendance_bp = Blueprint("attendance", __name__)


# ======================================
# GET ALL ATTENDANCE RECORDS
# ======================================

@attendance_bp.route("/attendance", methods=["GET"])
def get_attendance():

    connection = get_db_connection()

    if connection is None:
        return jsonify({
            "success": False,
            "message": "Database Connection Failed."
        }), 500

    cursor = connection.cursor(dictionary=True)

    query = """
        SELECT *
        FROM attendance
        ORDER BY attendance_date DESC, id ASC
    """

    cursor.execute(query)

    attendance = cursor.fetchall()

    cursor.close()
    connection.close()

    return jsonify(attendance)


# ======================================
# GET ATTENDANCE BY ID
# ======================================

@attendance_bp.route("/attendance/<int:id>", methods=["GET"])
def get_attendance_record(id):

    connection = get_db_connection()

    if connection is None:
        return jsonify({
            "success": False,
            "message": "Database Connection Failed."
        }), 500

    cursor = connection.cursor(dictionary=True)

    query = """
        SELECT *
        FROM attendance
        WHERE id = %s
    """

    cursor.execute(query, (id,))

    record = cursor.fetchone()

    cursor.close()
    connection.close()

    if record:
        return jsonify(record)

    return jsonify({
        "success": False,
        "message": "Attendance Record Not Found."
    }), 404


# ======================================
# ADD ATTENDANCE
# ======================================

@attendance_bp.route("/attendance", methods=["POST"])
def add_attendance():

    data = request.get_json()

    student_name = data.get("student_name", "").strip()
    attendance_date = data.get("attendance_date", "").strip()
    status = data.get("status", "").strip()

    if student_name == "" or attendance_date == "" or status == "":

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
        INSERT INTO attendance
        (
            student_name,
            attendance_date,
            status
        )
        VALUES
        (
            %s,
            %s,
            %s
        )
    """

    cursor.execute(
        query,
        (
            student_name,
            attendance_date,
            status
        )
    )

    connection.commit()

    cursor.close()
    connection.close()

    return jsonify({
        "success": True,
        "message": "Attendance Added Successfully."
    }), 201


# ======================================
# UPDATE ATTENDANCE
# ======================================

@attendance_bp.route("/attendance/<int:id>", methods=["PUT"])
def update_attendance(id):

    data = request.get_json()

    student_name = data.get("student_name", "").strip()
    attendance_date = data.get("attendance_date", "").strip()
    status = data.get("status", "").strip()

    connection = get_db_connection()

    if connection is None:

        return jsonify({
            "success": False,
            "message": "Database Connection Failed."
        }), 500

    cursor = connection.cursor()

    query = """
        UPDATE attendance
        SET
            student_name = %s,
            attendance_date = %s,
            status = %s
        WHERE id = %s
    """

    cursor.execute(
        query,
        (
            student_name,
            attendance_date,
            status,
            id
        )
    )

    connection.commit()

    cursor.close()
    connection.close()

    return jsonify({
        "success": True,
        "message": "Attendance Updated Successfully."
    })


# ======================================
# DELETE ATTENDANCE
# ======================================

@attendance_bp.route("/attendance/<int:id>", methods=["DELETE"])
def delete_attendance(id):

    connection = get_db_connection()

    if connection is None:

        return jsonify({
            "success": False,
            "message": "Database Connection Failed."
        }), 500

    cursor = connection.cursor()

    query = """
        DELETE FROM attendance
        WHERE id = %s
    """

    cursor.execute(query, (id,))

    connection.commit()

    cursor.close()
    connection.close()

    return jsonify({
        "success": True,
        "message": "Attendance Deleted Successfully."
    })


# ======================================
# SEARCH ATTENDANCE
# ======================================

@attendance_bp.route("/attendance/search/<string:keyword>", methods=["GET"])
def search_attendance(keyword):

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
        FROM attendance
        WHERE
            student_name LIKE %s
            OR attendance_date LIKE %s
            OR status LIKE %s
        ORDER BY attendance_date DESC
    """

    cursor.execute(
        query,
        (
            value,
            value,
            value
        )
    )

    attendance = cursor.fetchall()

    cursor.close()
    connection.close()

    return jsonify(attendance)