import mysql.connector
from mysql.connector import Error

# ==============================
# DATABASE CONFIGURATION
# ==============================

DB_HOST = "localhost"
DB_USER = "root"
DB_PASSWORD = "success@7"
DB_NAME = "cms_db"


# ==============================
# DATABASE CONNECTION FUNCTION
# ==============================

def get_db_connection():
    """
    Creates and returns a MySQL database connection.
    Returns None if the connection fails.
    """

    try:
        connection = mysql.connector.connect(
            host=DB_HOST,
            user=DB_USER,
            password=DB_PASSWORD,
            database=DB_NAME
        )

        if connection.is_connected():
            print("✅ Database Connected Successfully")
            return connection

    except Error as e:
        print("❌ Database Connection Error")
        print(e)
        return None