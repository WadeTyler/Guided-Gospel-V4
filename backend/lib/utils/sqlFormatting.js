
const getTimestampInSQLFormat = () => {
  const timestamp = new Date().toISOString().replace('T', ' ').substring(0, 19);
  return timestamp;
}

module.exports = {
  getTimestampInSQLFormat
}