import jwt from "jsonwebtoken";
import User from "../models/user.model.js";

const protectRoute = async (req, res, next) => {
  try {
    //Get the token
    const token = req.cookies.jwt;
    //If not return 401
    if (!token)
      return res.status(401).json({ error: "Unauthorized - No token provied" });
    // Decode token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    //If not return 401
    if (!decoded)
      return res.status(401).json({ error: "Unauthorized - Invalid token" });
    //Find user by id
    const user = await User.findById(decoded.userId).select("-password");
    //If not return 404
    if (!user) return res.status(404).json({ error: "User not found" });
    //Assign user to res
    req.user = user;
    //Next
    next();
  } catch (error) {
    console.error("Error in protectRoute middleware: ", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
export default protectRoute;
