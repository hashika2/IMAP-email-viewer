import imaps from "imap-simple";

function buildXOAuth2Token(email: string, accessToken: string) {
  const sasl = `user=${email}\u0001auth=Bearer ${accessToken}\u0001\u0001`;
  return Buffer.from(sasl).toString("base64");
}

export async function readEmails(email: string, accessToken: string) {
  const xoauth2 = buildXOAuth2Token(email, accessToken);

  const config = {
    imap: {
      user: email,
      xoauth2,
      host: "imap.gmail.com",
      port: 993,
      tls: true,
      tlsOptions: { rejectUnauthorized: false },
      authTimeout: 10000,     // <-- FIX
      connTimeout: 10000,     // <-- FIX
      socketTimeout: 10000,   // <-- FIX
    },
  };

  const connection = await imaps.connect(config as any);

  await connection.openBox("INBOX");

  const results = await connection.search(["ALL"], {
    bodies:['HEADER.FIELDS (FROM TO SUBJECT DATE)'],
    struct: true,
    // markSeen: false,
  });

  return results;
}