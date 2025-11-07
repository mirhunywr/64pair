const { makeid } = require('./gen-id');
const express = require('express');
const fs = require('fs');
let router = express.Router();
const pino = require("pino");
const {
  default: makeWASocket,
  useMultiFileAuthState,
  delay,
  Browsers,
  makeCacheableSignalKeyStore,
} = require('@whiskeysockets/baileys');

function removeFile(FilePath) {
  if (!fs.existsSync(FilePath)) return false;
  fs.rmSync(FilePath, { recursive: true, force: true });
}

router.get('/', async (req, res) => {
  const id = makeid();
  let num = req.query.number;

  const { state, saveCreds } = await useMultiFileAuthState('./temp/' + id);
  try {
    const browsers = ["Safari", "Chrome", "Firefox"];
    const randomBrowser = browsers[Math.floor(Math.random() * browsers.length)];

    const sock = makeWASocket({
      auth: {
        creds: state.creds,
        keys: makeCacheableSignalKeyStore(
          state.keys,
          pino({ level: "fatal" }).child({ level: "fatal" })
        ),
      },
      printQRInTerminal: false,
      logger: pino({ level: "fatal" }),
      browser: Browsers.macOS(randomBrowser),
    });

    if (!sock.authState.creds.registered) {
      await delay(1500);
      num = num.replace(/[^0-9]/g, '');
      const code = await sock.requestPairingCode(num, "QADEERAI");
      if (!res.headersSent) {
        await res.send({ code });
      }
    }

    sock.ev.on('creds.update', saveCreds);

    sock.ev.on("connection.update", async (s) => {
      const { connection, lastDisconnect } = s;

      if (connection === "open") {
        await delay(5000);

        const rf = __dirname + `/temp/${id}/creds.json`;
        const sessionData = fs.readFileSync(rf);
        const base64Session = Buffer.from(sessionData).toString('base64');
        const stringSession = `QADEER-AI~${base64Session}`;

        try {
          await sock.sendMessage(sock.user.id, { text: stringSession });

          const desc = `*Hey there, QADEER-AI User!* 👋🏻

Thanks for using *QADEER-AI* — your session has been successfully created!

🔐 *Session ID:* Sent above (Base64 Encoded)
⚠️ *Keep it safe!* Do NOT share this ID with anyone.
🔱 *By Order of The Qadeer XMD 🎩

——————

*✅ Stay Updated:*  
Join the Qadeer AI community👇  
https://whatsapp.com/channel/0029VbAkAEhCRs1g8MmyEJ2K

*💻 Source Code:*  
https://github.com/QadeerXTech/QADEER-AI

——————

> *© Powered by Qadeer XMD*  
By Order of the Qadeer 🔱. ✌🏻`;

          await sock.sendMessage(sock.user.id, {
            text: desc,
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
        } catch (e) {
          await sock.sendMessage(sock.user.id, { text: e.toString() });
        }

        await delay(500);
        await sock.ws.close();
        await removeFile('./temp/' + id);
        console.log(`👤 ${sock.user.id} Connected ✅ Session generated & closed.`);
        process.exit();

      } else if (
        connection === "close" &&
        lastDisconnect &&
        lastDisconnect.error &&
        lastDisconnect.error.output.statusCode != 401
      ) {
        await delay(2000);
        router.get('/', async (req, res) => {}); // reinit optional
      }
    });
  } catch (err) {
    console.log("Service restarted due to error:", err);
    await removeFile('./temp/' + id);
    if (!res.headersSent) {
      await res.send({ code: "❗ Service Unavailable" });
    }
  }
});

module.exports = router;
