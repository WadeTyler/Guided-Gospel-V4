

const checkIfPostExists = async (req, res, next) => {
  try {
    const postid = req.params.postid;

    if (!postid) {
      return res.status(400).json({ error: "Post ID is required" });
    }

    next();

  } catch (error) {
    console.error("Error in checkIfPostExists middleware", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}

module.exports = {
  checkIfPostExists
}