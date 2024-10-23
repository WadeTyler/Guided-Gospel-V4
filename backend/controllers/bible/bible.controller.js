const db = require('../../db/db');

const getVersesInChapter = async (req, res) => {
  try {
    const { bookName, chapterNum } = req.params;

    if (!bookName) {
      return res.status(400).send("Book name is required");
    }
    if (!chapterNum) {
      return res.status(400).send("Chapter number is required");
    }

    const query = `SELECT * FROM Verses WHERE chapterid = (SELECT chapterid FROM Chapters WHERE bookid = (SELECT bookid FROM Books WHERE bookName = ?) AND chapterNum = ?)`;
    const [verses] = await db.query(query, [bookName, chapterNum]);

    return res.status(200).json(verses);

  } catch (error) {
    console.log("Error in getVersesInChapter controller: ", error);
    res.status(500).send("Internal server error");
  }
}

const getChapters = async (req, res) => {
  try {
    const { bookName } = req.params;
    if (!bookName) {
      return res.status(400).send("Book name is required");
    }

    const query = `SELECT * FROM Chapters WHERE bookid = (SELECT bookid FROM Books WHERE bookName = ?)`;
    const [chapters] = await db.query(query, [bookName]);

    return res.status(200).json(chapters);
  } catch (error) {
    console.log("Error in getChapters controller: ", error);
    res.status(500).send("Internal server error");
  }
}

const getBooks = async (req, res) => {
  try {
    const query = `SELECT * FROM Books`;
    const [books] = await db.query(query);

    return res.status(200).json(books);
  } catch (error) {
    console.log("Error in getBooks controller: ", error);
    res.status(500).send("Internal server error");
  }
}

module.exports = {
  getVersesInChapter,
  getChapters,
  getBooks,

}