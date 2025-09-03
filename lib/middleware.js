import jwt from "jsonwebtoken";

// ✅ middleware to check JWT
export const authMiddleware = (req, res, next) => {
  const token = req.cookies.token; 

  if (!token) {
    return res
      .status(401)
      .json({ success: false, message: "No token, unauthorized" });
  }

  try {
    const decoded = jwt.verify(token, process.env.SECRET);
    req.user = decoded; // attach decoded data to req
    next();
  } catch (error) {
    return res
      .status(401)
      .json({ success: false, message: "Invalid or expired token" });
  }
};
