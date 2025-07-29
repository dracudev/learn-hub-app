const jwt = require("jsonwebtoken");

function signJwt(payload) {
  return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "24h" });
}

function verifyJwt(token) {
  try {
    return jwt.verify(token, process.env.JWT_SECRET);
  } catch (err) {
    return null;
  }
}

module.exports = { signJwt, verifyJwt };
