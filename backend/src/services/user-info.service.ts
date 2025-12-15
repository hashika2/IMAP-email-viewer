import { OAuth2Client } from "google-auth-library";
import db from "../models";
import dotenv from 'dotenv';
dotenv.config();

const client = new OAuth2Client();

export const getUserInfo = async (access_token: string) => {
    const userInfo = await fetch(
      "https://www.googleapis.com/oauth2/v2/userinfo",
      {
        headers: { Authorization: `Bearer ${access_token}` }
      }
    ).then(r => r.json());
    return userInfo;
}

export const saveUserInfo = async (idToken: string, tokens: any) => {
  const ticket = await client.verifyIdToken({
    idToken,
    audience: process.env.GOOGLE_CLIENT_ID,
  });
  const payload = ticket.getPayload();
  if (!payload?.email) throw new Error("Email not found in payload");

  const [user, created] = await db.User.findOrCreate({
    where: { email: payload.email },
    defaults: {
      name: payload.name || payload.email,
      email: payload.email,
      access_token: tokens.access_token!,
      // Consider saving refresh_token as well if you need long-term access
      // refresh_token: tokens.refresh_token,
    },
  });

  if (!created) {
    // User already exists, update tokens
    user.access_token = tokens.access_token!;
    // If you're saving refresh tokens, update them here:
    // user.refresh_token = tokens.refresh_token;
    await user.save();
  }
};
