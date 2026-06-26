from flask import Blueprint, jsonify
from database.db import connection, cursor

dashboard_bp = Blueprint("dashboard", __name__)

@dashboard_bp.route("/dashboard/stats", methods=["GET"])
def get_dashboard_stats():
    try:
        connection.ping(reconnect=True)
        
        # 1. Count Total Students
        cursor.execute("SELECT COUNT(*) AS total FROM students")
        student_count = cursor.fetchone()["total"]
        
        # 2. Count Total Teachers
        cursor.execute("SELECT COUNT(*) AS total FROM teachers")
        teacher_count = cursor.fetchone()["total"]
        
        # 3. Optional: Count Total Courses if you use it
        cursor.execute("SELECT COUNT(*) AS total FROM courses")
        course_count = cursor.fetchone()["total"]

        return jsonify({
            "totalStudents": student_count,
            "totalTeachers": teacher_count,
            "totalCourses": course_count,
            "averageAttendance": "85%"  # Placeholder value for now
        }), 200
        
    except Exception as e:
        print("Error fetching dashboard statistics:", str(e))
        return jsonify({"error": "Failed to calculate statistics statistics"}), 500
