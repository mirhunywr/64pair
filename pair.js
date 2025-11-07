const { makeid } = require('./gen-id');
const express = require('express');
const fs = require('fs');
let router = express.Router();
const { makeid } = require('./gen-id');
const express = require('express');
const fs = require('fs');
const pino = require("pino");
const {
  default: makeWASocket,
  useMultiFileAuthState,
  delay,
  Browsers,
  makeCacheableSignalKeyStore
} = require('@whiskeysockets/baileys');

let router = express.Router();

function removeFile(path) {
  if (fs.existsSync(path)) fs.rmSync(path, { recursive: true, force: true });
}

router.get('/', async (req, res) => {
  try {
    const id = makeid();
    let number = req.query.number;
    if (!number) return res.status(400).send({ error: "Number required ?number=923xxxxxxxxx" });

    const { state, saveCreds } = await useMultiFileAuthState('./temp/' + id);

    const sock = makeWASocket({
      auth: {
        creds: state.creds,
        keys: makeCacheableSignalKeyStore(state.keys, pino({ level: "fatal" }))
      },
      printQRInTerminal: false,
      logger: pino({ level: "fatal" }),
      browser: Browsers.macOS("Safari")
    });

    // Generate pairing code
    if (!sock.authState.creds.registered) {
      number = number.replace(/[^0-9]/g, '');
      const code = await sock.requestPairingCode(number, "QADEERAI");

      // Send pairing code instantly to user
      if (!res.headersSent) res.send({ pairing_code: code });

      console.log(`📱 Pairing code for ${number}: ${code}`);
    }

    sock.ev.on('creds.update', saveCreds);

    sock.ev.on("connection.update", async (update) => {
      const { connection, lastDisconnect } = update;

      if (connection === "open") {
        console.log(`✅ Connected: ${sock.user.id}`);

        await delay(3000);
        const credsPath = `./temp/${id}/creds.json`;
        const credsData = fs.readFileSync(credsPath);
        const base64 = Buffer.from(credsData).toString('base64');
        const session = `QADEER-AI~${base64}`;

        await sock.sendMessage(sock.user.id, { text: session });

        const msg = `*Hey there, QADEER-AI User!* 👋🏻

Your long Base64 session ID has been created successfully!

🔐 *Session ID:* Sent above  
⚠️ *Keep it safe!* Never share with anyone.

——————

*✅ Stay Updated:*  
https://whatsapp.com/channel/0029VbAkAEhCRs1g8MmyEJ2K

*💻 Source Code:*  
https://github.com/QadeerXTech/QADEER-AI

——————
> *© Powered by Qadeer XMD*
By Order of Qadeer 🔱`;

        await sock.sendMessage(sock.user.id, {
          text: msg,
          contextInfo: {
            externalAdReply: {
              title: "ϙᴀᴅᴇᴇʀ ʙʀᴀʜᴠɪ",
              thumbnailUrl: "https://files.catbox.moe/cvn0l6.jpg",
              sourceUrl: "https://whatsapp.com/channel/0029VbAkAEhCRs1g8MmyEJ2K",
              mediaType: 1,
              renderLargerThumbnail: true
            }
          }
        });

        await delay(2000);
        await sock.ws.close();
        removeFile('./temp/' + id);
        console.log("🧹 Session folder cleaned. Closing process...");
        process.exit();
      }

      if (connection === "close" && lastDisconnect?.error?.output?.statusCode != 401) {
        console.log("⚠️ Reconnecting...");
      }
    });

  } catch (err) {
    console.log("❌ Error:", err);
    if (!res.headersSent) res.status(500).send({ error: "Service Unavailable", details: err.message });
  }
});

module.exports = router;
