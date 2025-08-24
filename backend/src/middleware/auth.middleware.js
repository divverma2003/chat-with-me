import jwt from "jsonwebtoken";
import User from "../models/user.model.js";

export const protectRoute = async (req, res, next) => {
  try {
    const token = req.cookies.jwtCookie; // set up in utils

    if (!token) {
      return res
        .status(401)
        .json({ message: "Unauthorized - No Token Provided." });
    }

    // decode token using the attributes set in utils (e.g: userId)
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (!decoded) {
      return res.status(401).json({ message: "Unauthorized - Invalid Token." });
    }

    // find user by id
    // select/fetch everything except for the user password
    const user = await User.findById(decoded.userId).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User Not Found." });
    }

    // add user info to the request object
    req.user = user;

    // ex: updateProfile, or whatever function that uses this one as middleware
    next();
  } catch (error) {
    console.log("Error in protectRoute middleware:", error.message);
    res.status(500).json({ message: "Internal Server Error." });
  }
};
