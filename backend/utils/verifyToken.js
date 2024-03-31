const jwt = require("jsonwebtoken");

const verifyToken = async (req, res, next) => {
  try {
    const cookie = req.headers.cookie;
    const token = cookie.split("=")[1];

    if (!token) {
      res.status(404).json({ msg: "Token not found !!" });
    }

    jwt.verify(String(token), process.env.JWT_SECERT, (err, data) => {
      if (err) {
        return res.status(400).json({ msg: "Invalid Token" });
      }
      req.id = data.user;
      next();
    });
  } catch (error) {
    return res.status(500).json({ msg: "Unexpected error Occured" });
  }
};

module.exports = verifyToken;
