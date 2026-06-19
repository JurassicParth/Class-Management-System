import mysql.connector

connection = mysql.connector.connect(
    host="localhost",
    user="root",
    password="success@7",
    database="cms_db"
)

cursor = connection.cursor(dictionary=True)

print("Database Connected Successfully")