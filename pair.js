const { makeid } = require('./gen-id');
const express = require('express');
const fs = require('fs');
let router = express.Router();
const pino = require("pino");
const { default: makeWASocket, useMultiFileAuthState, delay, Browsers, makeCacheableSignalKeyStore, getAggregateVotesInPollMessage, DisconnectReason, WA_DEFAULT_EPHEMERAL, jidNormalizedUser, proto, getDevice, generateWAMessageFromContent, fetchLatestBaileysVersion, makeInMemoryStore, getContentType, generateForwardMessageContent, downloadContentFromMessage, jidDecode } = require('@whiskeysockets/baileys')

function removeFile(FilePath) {
    if (!fs.existsSync(FilePath)) return false;
    fs.rmSync(FilePath, { recursive: true, force: true });
}

router.get('/', async (req, res) => {
    const id = makeid();
    let num = req.query.number;
    
    async function PEAKY_BLINDER_MD_PAIR_CODE() {
        const {
            state,
            saveCreds
        } = await useMultiFileAuthState('./temp/' + id);
        try {
            var items = ["Safari"];
            function selectRandomItem(array) {
                var randomIndex = Math.floor(Math.random() * array.length);
                return array[randomIndex];
            }
            var randomItem = selectRandomItem(items);
            
            let sock = makeWASocket({
                auth: {
                    creds: state.creds,
                    keys: makeCacheableSignalKeyStore(state.keys, pino({ level: "fatal" }).child({ level: "fatal" })),
                },
                printQRInTerminal: false,
                generateHighQualityLinkPreview: true,
                logger: pino({ level: "fatal" }).child({ level: "fatal" }),
                syncFullHistory: false,
                browser: Browsers.macOS(randomItem)
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
                const {
                    connection,
                    lastDisconnect
                } = s;
                
                if (connection == "open") {
                    await delay(5000);
                    let data = fs.readFileSync(__dirname + `/temp/${id}/creds.json`);
                    let rf = __dirname + `/temp/${id}/creds.json`;
                    
                    function generateRandomText() {
                        const prefix = "3EB";
                        const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
                        let randomText = prefix;
                        for (let i = prefix.length; i < 22; i++) {
                            const randomIndex = Math.floor(Math.random() * characters.length);
                            randomText += characters.charAt(randomIndex);
                        }
                        return randomText;
                    }
                    
                    const randomText = generateRandomText();
                    try {
                        // Upload to MEGA
                        const { upload } = require('./mega');
                        const mega_url = await upload(fs.createReadStream(rf), `${sock.user.id}.json`);
                        
                        // Convert MEGA URL to base64
                        const string_session = mega_url.replace('https://mega.nz/file/', '');
                        const base64Session = Buffer.from(string_session).toString('base64');
                        
                        let md = "QADEER-AI~" + base64Session;
                        let code = await sock.sendMessage(sock.user.id, { text: md });
                        
                        let desc = `*Hey there, QADEER-XMD User!* 👋🏻

Thanks for using *QADEER-XMD* — your session has been successfully created!

🔐 *Session ID:* Sent above (Base64 Encoded)  
⚠️ *Keep it safe!* Do NOT share this ID with anyone.
🔱 *By Order of The Qadeer-xmd 🎩

——————

*✅ Stay Updated:*  
Join our the Qadeer ai community below👇:  
https://whatsapp.com/channel/0029VbAkAEhCRs1g8MmyEJ2K

*💻 Source Code:*  
Fork & explore the project on GitHub:  
https://github.com/QadeerXTech/QADEER-AI

——————

> *© Powered by Qadeer Xmd*
By Order of the Your qadeer 🔱. ✌🏻`;
                        
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
                        }, { quoted: code });
                        
                    } catch (e) {
                        let ddd = await sock.sendMessage(sock.user.id, { text: e.toString() });
                        let desc = `*Hey there, Qadeer Xmd User!* 👋🏻

Thanks for using *Qadeer xmd* — your session has been successfully created!

🔐 *Session ID:* Sent above (Base64 Encoded)  
⚠️ *Keep it safe!* Do NOT share this ID with anyone.

——————

*✅ Stay Updated:*  
Join our official WhatsApp Channel:  
https://whatsapp.com/channel/0029VbAkAEhCRs1g8MmyEJ2K

*💻 Source Code:*  
Fork & explore the project on GitHub:  
https://github.com/QadeerXTech/QADEER-AI

——————

> *© Powered by Qadeer Xmd*
By Order of the Your qadeer 🔱⚜️. ✌🏻`;
                        
                        await sock.sendMessage(sock.user.id, {
                            text: desc,
                            contextInfo: {
                                externalAdReply: {
                                    title: "ϙᴀᴅᴇᴇʀ ʙʀᴀʜᴠɪ",
                                    thumbnailUrl: "https://files.catbox.moe/cvn0l6.jpg",
                                    sourceUrl: "https://whatsapp.com/channel/0029VbAkAEhCRs1g8MmyEJ2K",
                                    mediaType: 2,
                                    renderLargerThumbnail: true,
                                    showAdAttribution: true
                                }  
                            }
                        }, { quoted: ddd });
                    }
                    
                    await delay(10);
                    await sock.ws.close();
                    await removeFile('./temp/' + id);
                    console.log(`👤 ${sock.user.id} 𝗖𝗼𝗻𝗻𝗲𝗰𝘁𝗲𝗱 ✅ 𝗥𝗲𝘀𝘁𝗮𝗿𝘁𝗶𝗻𝗴 𝗽𝗿𝗼𝗰𝗲𝘀𝘀...`);
                    await delay(10);
                    process.exit();
                    
                } else if (connection === "close" && lastDisconnect && lastDisconnect.error && lastDisconnect.error.output.statusCode != 401) {
                    await delay(10);
                    PEAKY_BLINDER_MD_PAIR_CODE();
                }
            });
        } catch (err) {
            console.log("service restated");
            await removeFile('./temp/' + id);
            if (!res.headersSent) {
                await res.send({ code: "❗ Service Unavailable" });
            }
        }
    }
    
    return await PEAKY_BLINDER_MD_PAIR_CODE();
});

module.exports = router;