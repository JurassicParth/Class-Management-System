import mysql.connector

# Centralized database connection configuration
connection = mysql.connector.connect(
    host="localhost",
    user="root",
    password="success@7",
    database="cms_db"
)

# This cursor is shared across your main app and route blueprints
cursor = connection.cursor(dictionary=True)

print("Database Connected Successfully")
