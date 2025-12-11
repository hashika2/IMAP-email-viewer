import express, { Request, Response } from 'express';
import cors from 'cors';
import oauth2Client from './auth';
import authRoutes from './routes/auth.routes';
import emailRoutes from './routes/email.routes';
import { google } from "googleapis";
import dotenv from 'dotenv';
dotenv.config();

const app = express();
const port: number = 3001;

app.use(cors());
app.use(express.json());


// app.post("/api/google-exchange-code", async (req, res) => {
//     const { code } = req.body;
  
//     const oauth2 = new google.auth.OAuth2(
//         process.env.GOOGLE_CLIENT_ID,
//         process.env.GOOGLE_CLIENT_SECRET,
//         process.env.GOOGLE_REDIRECT_URI,
//     );
  
//     const { tokens } = await oauth2.getToken(code);
  
//     res.json({
//       access_token: tokens.access_token,
//       refresh_token: tokens.refresh_token
//     });
//   });

app.use("/auth", authRoutes);
app.use("/api", emailRoutes);



// // Basic route to check server status
// app.get('/', (req: Request, res: Response) => {
//     res.send('IMAP Backend is running!');
// });

// async function readEmails(accessToken: string) {
//   const xoauth2Token = buildXOAuth2Token("m.g.hashikamaduranga@gmail.com", accessToken);
//     const config = {
//       imap: {
//         user: "m.g.hashikamaduranga@gmail.com",
//         xoauth2: xoauth2Token,
//         host: "imap.gmail.com",
//         port: 993,
//         tls: true,
//         authTimeout: 3000,
//         tlsOptions: { rejectUnauthorized: false },
//       }
//     };
  
//     const connection = await ImapSimple.connect(config as ImapSimpleOptions);
//     await connection.openBox("INBOX");
  
//     const searchCriteria = ["UNSEEN"];
//     const fetchOptions = { bodies: ["HEADER", "TEXT"], markSeen: false };
  
//     const results = await connection.search(searchCriteria, fetchOptions);
  
//     return results.map((r: any) => ({
//       subject: r.parts[0].body.subject[0],
//       from: r.parts[0].body.from[0]
//     }));
//   }

//   function buildXOAuth2Token(email: string, accessToken: string) {
//     const sasl = `user=${email}\u0001auth=Bearer ${accessToken}\u0001\u0001`;
//     return Buffer.from(sasl).toString("base64");
//   }

// app.get("/auth/google", (req, res) => {
//     const url = oauth2Client.generateAuthUrl({
//       access_type: "offline",
//       scope: [
//         "https://mail.google.com/",   // Full Gmail IMAP/SMTP access
//         "openid",
//         "profile",
//         "email",
//       ],
//       prompt: "consent" // ensures refresh_token returns
//     });
  
//     res.redirect(url);
// });

// app.post("/api/get-emails", async (req, res) => {
//     const { access_token } = req.body;
    
//     try {
//       const emails = await readEmails(access_token);
//       res.json({ emails });
//     } catch (err) {
//       console.error(err);
//       res.status(500).json({ message: "Error reading emails" });
//     }
//   });

// app.get("/auth/callback", async (req, res) => {
//     const code = req.query.code;
  
//     try {
//       // 1. Exchange code for tokens
//       const { tokens } = await oauth2Client.getToken(code as string);
  
//       // 2. Save tokens in database if needed
//       // tokens = { access_token, refresh_token, scope, id_token, expiry_date }
  
//       console.log("Tokens received:", tokens);
  
//       // 3. Set tokens for OAuth client
//       oauth2Client.setCredentials(tokens);
  
//       // 4. Send to frontend or redirect
//       res.json({
//         message: "Login successful",
//         access_token: tokens.access_token,
//         refresh_token: tokens.refresh_token,
//         expiry_date: tokens.expiry_date,
//       });
//     } catch (err) {
//       console.error("Error exchanging code:", err);
//       res.status(500).send("Authentication failed");
//     }
//   });


app.listen(port, () => {
    console.log(`Backend server listening at http://localhost:${port}`);
});
