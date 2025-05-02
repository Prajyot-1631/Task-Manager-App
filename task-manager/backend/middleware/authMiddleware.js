const jwt = require("jsonwebtoken");
const JWT_SECRET = "supersecretkey";

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers.authorization; //gets the authorization header from the request

  //Check if Token is present and valid
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    //if no token or token doesn't start with Bearer, reject the request
    return res.status(401).json({ message: "Access Token missing or invalid" });
  }
  //   Extract the Token
  const token = authHeader.split(" ")[1]; //This splits "Bearer <token>" and grabs the actual token.

  //   Verify the Token
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    res.status(403).json({ message: "Invalid or expired Token" });
  }
};

module.exports = authenticateToken;
