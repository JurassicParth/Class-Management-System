from flask import Blueprint, request, jsonify
from database.db import get_db_connection

announcements_bp = Blueprint("announcements", __name__)


# ======================================
# GET ALL ANNOUNCEMENTS
# ======================================

@announcements_bp.route("/announcements", methods=["GET"])
def get_announcements():

    connection = get_db_connection()

    cursor = connection.cursor(dictionary=True)

    cursor.execute("""
        SELECT *
        FROM announcements
        ORDER BY announcement_date DESC
    """)

    announcements = cursor.fetchall()

    cursor.close()
    connection.close()

    return jsonify(announcements)


# ======================================
# ADD ANNOUNCEMENT
# ======================================

@announcements_bp.route("/announcements", methods=["POST"])
def add_announcement():

    data = request.get_json()

    title = data["title"]
    message = data["message"]
    announcement_date = data["announcement_date"]

    connection = get_db_connection()

    cursor = connection.cursor()

    cursor.execute("""
        INSERT INTO announcements
        (
            title,
            message,
            announcement_date
        )
        VALUES
        (%s,%s,%s)
    """,
    (
        title,
        message,
        announcement_date
    ))

    connection.commit()

    cursor.close()
    connection.close()

    return jsonify({
        "success": True,
        "message": "Announcement Added Successfully."
    }), 201


# ======================================
# UPDATE ANNOUNCEMENT
# ======================================

@announcements_bp.route("/announcements/<int:id>", methods=["PUT"])
def update_announcement(id):

    data = request.get_json()

    title = data["title"]
    message = data["message"]
    announcement_date = data["announcement_date"]

    connection = get_db_connection()

    cursor = connection.cursor()

    cursor.execute("""
        UPDATE announcements
        SET
        title=%s,
        message=%s,
        announcement_date=%s
        WHERE id=%s
    """,
    (
        title,
        message,
        announcement_date,
        id
    ))

    connection.commit()

    cursor.close()
    connection.close()

    return jsonify({
        "success": True,
        "message": "Announcement Updated Successfully."
    })


# ======================================
# DELETE ANNOUNCEMENT
# ======================================

@announcements_bp.route("/announcements/<int:id>", methods=["DELETE"])
def delete_announcement(id):

    connection = get_db_connection()

    cursor = connection.cursor()

    cursor.execute(
        "DELETE FROM announcements WHERE id=%s",
        (id,)
    )

    connection.commit()

    cursor.close()
    connection.close()

    return jsonify({
        "success": True,
        "message": "Announcement Deleted Successfully."
    })


# ======================================
# SEARCH ANNOUNCEMENT
# ======================================

@announcements_bp.route("/announcements/search/<string:keyword>", methods=["GET"])
def search_announcement(keyword):

    connection = get_db_connection()

    cursor = connection.cursor(dictionary=True)

    value = "%" + keyword + "%"

    cursor.execute("""
        SELECT *
        FROM announcements
        WHERE
        title LIKE %s
        OR message LIKE %s
    """,
    (
        value,
        value
    ))

    announcements = cursor.fetchall()

    cursor.close()
    connection.close()

    return jsonify(announcements)