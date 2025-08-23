import jwt from "jsonwebtoken";

export const generateToken = (userId, res) => {
  // map user to token
  const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });
  // Send cookie in the response (passed in)
  res.cookie("jwtCookie", token, {
    maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days
    httpOnly: true, // prevents XSS attacks
    sameSite: "strict", // CSRF attacks cross-site request forgery attacks
    secure: process.env.NODE_ENV !== "development" ? true : false, // cookie only sent over HTTPS in production
  });
};
