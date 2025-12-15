import { Router } from "express";
import { readEmails } from "../services/imap.service";
import { OAuth2Client } from "google-auth-library";
import dotenv from 'dotenv';
import { google } from "googleapis";
import { getUserInfo, saveUserInfo } from "../services/user-info.service";
import db from "../models";
dotenv.config();

const router = Router();

const client = new OAuth2Client();

router.post("/google-exchange-code", async (req, res) => {
  const { code } = req.body;
  if(!code){
    res.status(400).json({ error: "Code is empty" });
  }

  const oauth2 = new google.auth.OAuth2(
      process.env.GOOGLE_CLIENT_ID,
      process.env.GOOGLE_CLIENT_SECRET,
      process.env.GOOGLE_REDIRECT_URI,
  );

  const { tokens } = await oauth2.getToken(code);

  if(!tokens){
    res.status(400).json({ error: "Token is empty" });
  }

  // get user info and save database
  // await saveUserInfo(tokens.id_token!, tokens);

  res.json({
    access_token: tokens.access_token,
    refresh_token: tokens.refresh_token
  });
});

router.post("/get-emails", async (req, res) => {
  const { access_token } = req.body;
  const userInfo = await getUserInfo(access_token);
  try {
    const emails = await readEmails(userInfo.email, access_token);
    // emails.map(email => {
    //   return {
    //     uid: email.attributes?.uid,
    //     subject: email?.parts[0]?.body?.subject[0],
    //     from: email?.parts[0]?.body?.from[0],
    //     date: email?.parts[0]?.body?.date[0]
    //   }
    // })
    res.json({emails});
  } catch (e) {
    console.error("IMAP error:", e);
    res.status(500).json({ error: "Failed to read emails" });
  }
});

export async function verifyGoogleToken(idToken: string) {
  const ticket = await client.verifyIdToken({
    idToken,
    audience: process.env.GOOGLE_CLIENT_ID,
  });

  const payload = ticket.getPayload();
  if (!payload?.email) throw new Error("Email not found");

  return payload.email;
}

export default router;