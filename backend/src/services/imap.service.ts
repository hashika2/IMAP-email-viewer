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
      authTimeout: 10000, 
      connTimeout: 10000,
      socketTimeout: 10000,
    },
  };

  const connection = await imaps.connect(config as any);

  await connection.openBox("INBOX");

  const results = await connection.search(["ALL"], {
    bodies:['HEADER.FIELDS (FROM TO SUBJECT DATE)'],
    struct: true,
    // markSeen: false,
  });
   // Sort by newest
   const sorted = results.sort((a, b) => b.seqNo - a.seqNo);

   // Take latest 100
   const latest = sorted.slice(0, 100);
 
   // Extract subjects and data
   const emails = latest.map(msg => {
     const headerPart = msg.parts.find(p => p.which === 'HEADER.FIELDS (FROM TO SUBJECT DATE)');
 
    //  const parsedHeader = imaps.getParts(msg.parts)
    //    .find(p => p.which === 'HEADER.FIELDS (FROM TO SUBJECT DATE)');

     return headerPart
   });
 
   return emails;

}