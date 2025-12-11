import { Router } from "express";
import { generateAuthUrl, exchangeCodeForTokens } from "../config/googleClient";

const router = Router();

// User clicks login → redirect to Google
router.get("/google", (req, res) => {
  const url = generateAuthUrl();
  // console.log("Google login URL", url);
  res.redirect(url);
});

// Google redirects here with ?code=XYZ
router.get("/callback", async (req, res) => {
  console.log("Google callback received", req.query);
  const code = req.query.code as string;
  
  try {
    const tokens = await exchangeCodeForTokens(code);

    res.json({
      message: "Google OAuth success",
      access_token: tokens.access_token,
      refresh_token: tokens.refresh_token,
      id_token: tokens.id_token,
      expiry_date: tokens.expiry_date
    });
  } catch (error) {
    console.error("Error exchanging code:", error);
    res.status(500).json({ error: "OAuth token exchange failed" });
  }
});

export default router;