import { Router } from "express";
import { readEmails } from "../services/imap.service";
import { OAuth2Client } from "google-auth-library";
import dotenv from 'dotenv';
import { google } from "googleapis";
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

  res.json({
    access_token: tokens.access_token,
    refresh_token: tokens.refresh_token
  });
});

router.post("/get-emails", async (req, res) => {
  const { access_token } = req.body;
  const userInfo = await getUserInfo(access_token);
  try {
    // verify ID token → get user email
    // const email = await verifyGoogleToken(access_token);
    // console.log(email, '22222')
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

const getUserInfo = async (access_token: string) => {
  const userInfo = await fetch(
    "https://www.googleapis.com/oauth2/v2/userinfo",
    {
      headers: { Authorization: `Bearer ${access_token}` }
    }
  ).then(r => r.json());
  return userInfo;
}

export default router;