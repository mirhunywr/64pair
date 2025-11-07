const { makeid } = require('./gen-id');
const express = require('express');
const fs = require('fs');
let router = express.Router();
const pino = require("pino");
const { default: makeWASocket, useMultiFileAuthState, delay, Browsers, makeCacheableSignalKeyStore, DisconnectReason } = require('@whiskeysockets/baileys');

function removeFile(FilePath) {
    if (!fs.existsSync(FilePath)) return false;
    fs.rmSync(FilePath, { recursive: true, force: true });
}

router.get('/', async (req, res) => {
    const id = makeid();
    let num = req.query.number;
    
    // Path ko theek kiya gaya hai
    const sessionPath = './temp/' + id;

    async function QADEER_AI_PAIR_CODE() {
        const { state, saveCreds } = await useMultiFileAuthState(sessionPath);
        try {
            var items = ["Safari", "Firefox", "Chrome"];
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
                const { connection, lastDisconnect } = s;
                
                if (connection === "open") {
                    await delay(5000);
                    // File path ko theek kiya gaya hai
                    let rf = sessionPath + '/creds.json';

                    try {
                        // Read the creds.json file
                        const sessionData = fs.readFileSync(rf, 'utf-8');
                        // Encode the session data to Base64
                        const base64Encoded = Buffer.from(sessionData).toString('base64');
                        
                        // [FIXED] Session prefix ko 'QADEER-AI~' kar dia gaya hai
                        const prefixedSession = "QADEER-AI~" + base64Encoded;
                        
                        // Send the prefixed Base64 session string to the user
                        let message = `*✅ AAPKA BASE64 SESSION ID TAYAR HAI ✅*\n\nNeechay diye gaye code ko copy karke apne bot ke SESSION_ID mein paste kar dein.\n\n*Bot: QADEER-AI*`;
                        await sock.sendMessage(sock.user.id, { text: message });
                        await sock.sendMessage(sock.user.id, { text: prefixedSession });

                        let desc = `*┏━━━━━━━━━━━━━━*
*┃QADEER-AI SESSION IS*
*┃SUCCESSFULLY*
*┃CONNECTED ✅🔥*
*┗━━━━━━━━━━━━━━━*
▬▬▬▬▬▬▬▬▬▬▬▬▬▬
*❶ || Creator = *Qadeer Brahvi*
▬▬▬▬▬▬▬▬▬▬▬▬▬▬
*❷ || https://whatsapp.com/channel/0029Vadezmw41iQEO8kHTo2J
▬▬▬▬▬▬▬▬▬▬▬▬▬▬
*❸ || Owner =* https://wa.me/923300005253
▬▬▬▬▬▬▬▬▬▬▬▬▬▬
*❹ || Repo =* https://github.com/QadeerXTech/QADEER-AI
▬▬▬▬▬▬▬▬▬▬▬▬▬▬
*💙 ᴄʀᴇᴀᴛᴇᴅ ʙʏ ǫᴀᴅᴇᴇʀ ʙʀᴀʜᴠɪ 💛*`; 
                        await sock.sendMessage(sock.user.id, {
                            text: desc,
                            contextInfo: {
                                externalAdReply: {
                                    title: "QADEER-AI 👨🏻‍💻",
                                    thumbnailUrl: "https://files.catbox.moe/cvn0l6.jpg", // Qadeer-AI image
                                    sourceUrl: "https://whatsapp.com/channel/0029Vadezmw41iQEO8kHTo2J",
                                    mediaType: 1,
                                    renderLargerThumbnail: true
                                }  
                            }
                        });
                        // Follow channel
                        await sock.newsletterFollow("120363418906972955@newsletter");
                        
                    } catch (e) {
                        console.error("Session banane mein galti hui:", e);
                        await sock.sendMessage(sock.user.id, { text: "❌ Session banane mein koi error aagaya." });
                    }

                    await delay(1000);
                    await sock.ws.close();
                    
                    // Temp folder ko remove karein
                    await removeFile(sessionPath);
                    console.log(`👤 ${sock.user.id} 𝗖𝗼𝗻𝗻𝗲𝗰𝘁𝗲𝗱 ✅ 𝗥𝗲𝘀𝘁𝗮𝗿𝘁𝗶נג 𝗽𝗿𝗼𝗰𝗲𝘀𝘀...`);
                    await delay(10);
                    process.exit(); // Exit process
                } else if (connection === "close" && lastDisconnect && lastDisconnect.error && lastDisconnect.error.output.statusCode != 401) {
                    await delay(10000);
                    QADEER_AI_PAIR_CODE();
                }
            });
        } catch (err) {
            console.log("service restated", err);
            // Error ki soorat mein bhi temp folder remove karein
            await removeFile(sessionPath);
            if (!res.headersSent) {
                await res.send({ code: "❗ Service Unavailable" });
            }
        }
    }
    return await QADEER_AI_PAIR_CODE();
});

module.exports = router;
