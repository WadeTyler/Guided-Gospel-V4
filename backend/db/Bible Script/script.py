import json
import mysql.connector

# Database connection configuration
db_config = {
    'user': 'username',        # Replace with your MySQL username
    'password': 'password',    # Replace with your MySQL password
    'host': 'localhost',             # Replace with your MySQL host if different
    'database': 'databasename' # Replace with your database name
}

def insert_data(cursor, book, chapters):
    # Insert book into Books table
    cursor.execute(
        "INSERT INTO Books (abbrev, bookName) VALUES (%s, %s)",
        (book["abbrev"], book["name"])
    )
    book_id = cursor.lastrowid

    for chapter_num, verses in enumerate(chapters, start=1):
        # Insert chapter into Chapters table
        cursor.execute(
            "INSERT INTO Chapters (bookid, chapterNum) VALUES (%s, %s)",
            (book_id, chapter_num)
        )
        chapter_id = cursor.lastrowid

        for verse_num, verse_text in enumerate(verses, start=1):
            # Insert verse into Verses table
            cursor.execute(
                "INSERT INTO Verses (chapterid, verseNum, text) VALUES (%s, %s, %s)",
                (chapter_id, verse_num, verse_text)
            )

def main():
    # Load JSON data from file
    with open('bible.json', 'r', encoding='utf-8') as f:
        bible = json.load(f)

    # Connect to the database
    connection = mysql.connector.connect(**db_config)
    cursor = connection.cursor()

    # Insert data into the database
    for book in bible:
        insert_data(cursor, book, book["chapters"])

    # Commit changes and close the connection
    connection.commit()
    cursor.close()
    connection.close()
    print("Data has been successfully inserted into the database.")

if __name__ == "__main__":
    main()
