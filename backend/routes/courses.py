from flask import Blueprint, request, jsonify
from database.db import get_db_connection

courses_bp = Blueprint("courses", __name__)


# ======================================
# GET ALL COURSES
# ======================================

@courses_bp.route("/courses", methods=["GET"])
def get_courses():

    connection = get_db_connection()

    if connection is None:
        return jsonify({
            "success": False,
            "message": "Database Connection Failed."
        }), 500

    cursor = connection.cursor(dictionary=True)

    query = """
        SELECT *
        FROM courses
        ORDER BY id ASC
    """

    cursor.execute(query)

    courses = cursor.fetchall()

    cursor.close()
    connection.close()

    return jsonify(courses)


# ======================================
# GET COURSE BY ID
# ======================================

@courses_bp.route("/courses/<int:id>", methods=["GET"])
def get_course(id):

    connection = get_db_connection()

    if connection is None:
        return jsonify({
            "success": False,
            "message": "Database Connection Failed."
        }), 500

    cursor = connection.cursor(dictionary=True)

    query = """
        SELECT *
        FROM courses
        WHERE id = %s
    """

    cursor.execute(query, (id,))

    course = cursor.fetchone()

    cursor.close()
    connection.close()

    if course:
        return jsonify(course)

    return jsonify({
        "success": False,
        "message": "Course Not Found."
    }), 404


# ======================================
# ADD NEW COURSE
# ======================================

@courses_bp.route("/courses", methods=["POST"])
def add_course():

    data = request.get_json()

    course_code = data.get("course_code", "").strip()
    course_name = data.get("course_name", "").strip()
    duration = data.get("duration", "").strip()

    if course_code == "" or course_name == "" or duration == "":

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
        INSERT INTO courses
        (
            course_code,
            course_name,
            duration
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
            course_code,
            course_name,
            duration
        )
    )

    connection.commit()

    cursor.close()
    connection.close()

    return jsonify({
        "success": True,
        "message": "Course Added Successfully."
    }), 201


# ======================================
# UPDATE COURSE
# ======================================

@courses_bp.route("/courses/<int:id>", methods=["PUT"])
def update_course(id):

    data = request.get_json()

    course_code = data.get("course_code", "").strip()
    course_name = data.get("course_name", "").strip()
    duration = data.get("duration", "").strip()

    connection = get_db_connection()

    if connection is None:

        return jsonify({
            "success": False,
            "message": "Database Connection Failed."
        }), 500

    cursor = connection.cursor()

    query = """
        UPDATE courses
        SET
            course_code = %s,
            course_name = %s,
            duration = %s
        WHERE id = %s
    """

    cursor.execute(
        query,
        (
            course_code,
            course_name,
            duration,
            id
        )
    )

    connection.commit()

    cursor.close()
    connection.close()

    return jsonify({
        "success": True,
        "message": "Course Updated Successfully."
    })


# ======================================
# DELETE COURSE
# ======================================

@courses_bp.route("/courses/<int:id>", methods=["DELETE"])
def delete_course(id):

    connection = get_db_connection()

    if connection is None:

        return jsonify({
            "success": False,
            "message": "Database Connection Failed."
        }), 500

    cursor = connection.cursor()

    query = """
        DELETE FROM courses
        WHERE id = %s
    """

    cursor.execute(query, (id,))

    connection.commit()

    cursor.close()
    connection.close()

    return jsonify({
        "success": True,
        "message": "Course Deleted Successfully."
    })


# ======================================
# SEARCH COURSE
# ======================================

@courses_bp.route("/courses/search/<string:keyword>", methods=["GET"])
def search_course(keyword):

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
        FROM courses
        WHERE
            course_code LIKE %s
            OR course_name LIKE %s
            OR duration LIKE %s
        ORDER BY id ASC
    """

    cursor.execute(
        query,
        (
            value,
            value,
            value
        )
    )

    courses = cursor.fetchall()

    cursor.close()
    connection.close()

    return jsonify(courses)