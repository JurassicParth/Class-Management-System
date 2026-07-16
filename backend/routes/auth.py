from flask import Blueprint, request, jsonify
from database.db import get_db_connection

auth_bp = Blueprint("auth", __name__)


# ==============================
# ADMIN LOGIN
# ==============================

@auth_bp.route("/login", methods=["POST"])
def login():

    data = request.get_json()

    username = data.get("username")
    password = data.get("password")

    connection = get_db_connection()

    if connection is None:
        return jsonify({
            "success": False,
            "message": "Database Connection Failed"
        }), 500

    cursor = connection.cursor(dictionary=True)

    query = """
        SELECT *
        FROM admin
        WHERE username = %s
        AND password = %s
    """

    cursor.execute(query, (username, password))

    admin = cursor.fetchone()

    cursor.close()
    connection.close()

    if admin:

        return jsonify({
            "success": True,
            "message": "Login Successful",
            "admin": {
                "id": admin["id"],
                "username": admin["username"],
                "email": admin["email"]
            }
        })

    return jsonify({
        "success": False,
        "message": "Invalid Username or Password"
    }), 401


# ==============================
# ADMIN SIGNUP
# ==============================

@auth_bp.route("/signup", methods=["POST"])
def signup():

    data = request.get_json()

    username = data.get("username")
    email = data.get("email")
    password = data.get("password")

    connection = get_db_connection()

    if connection is None:
        return jsonify({
            "success": False,
            "message": "Database Connection Failed"
        }), 500

    cursor = connection.cursor(dictionary=True)

    check_query = """
        SELECT *
        FROM admins
        WHERE username = %s
        OR email = %s
    """

    cursor.execute(check_query, (username, email))

    existing_user = cursor.fetchone()

    if existing_user:

        cursor.close()
        connection.close()

        return jsonify({
            "success": False,
            "message": "Username or Email already exists"
        }), 409

    insert_query = """
        INSERT INTO admins
        (username, email, password)
        VALUES (%s, %s, %s)
    """

    cursor.execute(insert_query, (
        username,
        email,
        password
    ))

    connection.commit()

    cursor.close()
    connection.close()

    return jsonify({
        "success": True,
        "message": "Signup Successful"
    }), 201
    
# ======================================
# AUTH TEST
# ======================================

@auth_bp.route("/auth-test", methods=["GET"])
def auth_test():

    return jsonify({
        "success": True,
        "message": "Authentication Route Working Successfully"
    })