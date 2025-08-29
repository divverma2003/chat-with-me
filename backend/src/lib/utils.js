import jwt from "jsonwebtoken";
import crypto from "crypto";

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

export const generateVerificationToken = () => {
  return crypto.randomBytes(32).toString("hex");
};

export const prepareVerificationEmail = (
  verificationToken,
  userEmail,
  fullName
) => {
  const verificationUrl = `${process.env.CLIENT_URL}/verify-email/${verificationToken}`;

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: userEmail,
    subject: "Verify Your Email - Chat With Me",
    html: `
        <div style="max-width: 600px; margin: 0 auto; padding: 20px; font-family: Arial, sans-serif;">
          <h1 style="color: #4CAF50; text-align: center;">Welcome to Chat With Me!</h1>
          <p>Hi <strong>${fullName}</strong>,</p>
          <p>Thank you for registering! Please click the button below to verify your email address:</p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${verificationUrl}" 
               style="background-color: #4CAF50; color: white; padding: 15px 30px; text-decoration: none; border-radius: 5px; font-weight: bold;">
              Verify My Email
            </a>
          </div>
          <p>Or copy and paste this link into your browser:</p>
          <p style="word-break: break-all; color: #666;">${verificationUrl}</p>
          <p><strong>Important:</strong> This link will expire in 24 hours for security reasons.</p>
          <hr style="margin: 30px 0; border: none; border-top: 1px solid #eee;">
          <p style="color: #888; font-size: 12px;">
            If you didn't create an account, please ignore this email.
          </p>
        </div>
      `,
  };

  return mailOptions;
};
