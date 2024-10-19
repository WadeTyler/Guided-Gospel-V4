

const protectedRoute = (req, res, next) => {
  const userid = req.cookies.userid;
  if (!userid) {
    return res.status(404).json({ message: "User id not found" });
  }
  next();
}

module.exports = protectedRoute;