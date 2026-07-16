from database.db import get_db_connection

connection = get_db_connection()

if connection:
    print("Connection Successful")
    connection.close()
else:
    print("Connection Failed")