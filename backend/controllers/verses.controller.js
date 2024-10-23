const db = require('../db/db');

const getVotd = async (req, res) => {

  const today = new Date();

  const month = today.getMonth();
  const evenMonth = month % 2 === 0;

  var id = 1;

  if (!evenMonth) {
    id = today.getDate();
  }

  else if (evenMonth) {
    id = today.getDate() + 31;
  }

  const query = 'SELECT * FROM verses WHERE id = ?';
  const [verse] = await db.query(query, [id]);
  
  res.status(200).json(verse[0]);

}

module.exports = {
  getVotd
}