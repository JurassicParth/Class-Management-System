from flask import Blueprint, jsonify, request
from database.db import connection, cursor

students_bp = Blueprint("students", __name__)

@students_bp.route("/students", methods=["GET"])
def get_students():

    cursor.execute("SELECT * FROM students")

    students = cursor.fetchall()

    print("Students Found:")
    print(students)

    return jsonify(students)