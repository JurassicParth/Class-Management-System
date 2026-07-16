from flask import Blueprint, request, jsonify
from database.db import get_db_connection

marks_bp = Blueprint("marks", __name__)


# ======================================
# GET ALL MARKS
# ======================================

@marks_bp.route("/marks", methods=["GET"])
def get_marks():

    connection = get_db_connection()

    if connection is None:
        return jsonify({
            "success": False,
            "message": "Database Connection Failed."
        }), 500

    cursor = connection.cursor(dictionary=True)

    cursor.execute("""
        SELECT *
        FROM marks
        ORDER BY id ASC
    """)

    marks = cursor.fetchall()

    cursor.close()
    connection.close()

    return jsonify(marks)


# ======================================
# GET MARK BY ID
# ======================================

@marks_bp.route("/marks/<int:id>", methods=["GET"])
def get_mark(id):

    connection = get_db_connection()

    if connection is None:
        return jsonify({
            "success": False,
            "message": "Database Connection Failed."
        }), 500

    cursor = connection.cursor(dictionary=True)

    cursor.execute(
        "SELECT * FROM marks WHERE id=%s",
        (id,)
    )

    mark = cursor.fetchone()

    cursor.close()
    connection.close()

    if mark:
        return jsonify(mark)

    return jsonify({
        "success": False,
        "message": "Record Not Found."
    }), 404


# ======================================
# ADD MARKS
# ======================================

@marks_bp.route("/marks", methods=["POST"])
def add_marks():

    data = request.get_json()

    student_name = data.get("student_name", "").strip()
    subject = data.get("subject", "").strip()
    marks_obtained = float(data.get("marks_obtained"))
    total_marks = float(data.get("total_marks"))

    percentage = round((marks_obtained / total_marks) * 100, 2)

    if percentage >= 90:
        grade = "A+"
    elif percentage >= 80:
        grade = "A"
    elif percentage >= 70:
        grade = "B"
    elif percentage >= 60:
        grade = "C"
    elif percentage >= 50:
        grade = "D"
    else:
        grade = "F"

    connection = get_db_connection()

    cursor = connection.cursor()

    cursor.execute("""
        INSERT INTO marks
        (
            student_name,
            subject,
            marks_obtained,
            total_marks,
            percentage,
            grade
        )
        VALUES
        (%s,%s,%s,%s,%s,%s)
    """,
    (
        student_name,
        subject,
        marks_obtained,
        total_marks,
        percentage,
        grade
    ))

    connection.commit()

    cursor.close()
    connection.close()

    return jsonify({
        "success": True,
        "message": "Marks Added Successfully."
    }), 201


# ======================================
# UPDATE MARKS
# ======================================

@marks_bp.route("/marks/<int:id>", methods=["PUT"])
def update_marks(id):

    data = request.get_json()

    student_name = data["student_name"]
    subject = data["subject"]
    marks_obtained = float(data["marks_obtained"])
    total_marks = float(data["total_marks"])

    percentage = round((marks_obtained / total_marks) * 100, 2)

    if percentage >= 90:
        grade = "A+"
    elif percentage >= 80:
        grade = "A"
    elif percentage >= 70:
        grade = "B"
    elif percentage >= 60:
        grade = "C"
    elif percentage >= 50:
        grade = "D"
    else:
        grade = "F"

    connection = get_db_connection()

    cursor = connection.cursor()

    cursor.execute("""
        UPDATE marks
        SET
        student_name=%s,
        subject=%s,
        marks_obtained=%s,
        total_marks=%s,
        percentage=%s,
        grade=%s
        WHERE id=%s
    """,
    (
        student_name,
        subject,
        marks_obtained,
        total_marks,
        percentage,
        grade,
        id
    ))

    connection.commit()

    cursor.close()
    connection.close()

    return jsonify({
        "success": True,
        "message": "Marks Updated Successfully."
    })


# ======================================
# DELETE MARKS
# ======================================

@marks_bp.route("/marks/<int:id>", methods=["DELETE"])
def delete_marks(id):

    connection = get_db_connection()

    cursor = connection.cursor()

    cursor.execute(
        "DELETE FROM marks WHERE id=%s",
        (id,)
    )

    connection.commit()

    cursor.close()
    connection.close()

    return jsonify({
        "success": True,
        "message": "Marks Deleted Successfully."
    })


# ======================================
# SEARCH MARKS
# ======================================

@marks_bp.route("/marks/search/<string:keyword>", methods=["GET"])
def search_marks(keyword):

    connection = get_db_connection()

    cursor = connection.cursor(dictionary=True)

    value = "%" + keyword + "%"

    cursor.execute("""
        SELECT *
        FROM marks
        WHERE
        student_name LIKE %s
        OR subject LIKE %s
        OR grade LIKE %s
    """,
    (
        value,
        value,
        value
    ))

    marks = cursor.fetchall()

    cursor.close()
    connection.close()

    return jsonify(marks)