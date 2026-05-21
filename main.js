const { default: makeWASocket, useMultiFileAuthState, DisconnectReason, fetchLatestBaileysVersion } = require("@whiskeysockets/baileys");
const fs = require("fs-extra");
const pino = require("pino");
const path = require("path");
const http = require("http");

async function startBot() {
    const sessionPath = path.join(__dirname, "session");
    await fs.ensureDir(sessionPath);

    const { state, saveCreds } = await useMultiFileAuthState(sessionPath);
    const { version } = await fetchLatestBaileysVersion();

    const sock = makeWASocket({
        version,
        auth: state,
        logger: pino({ level: "silent" }),
        browser: ["Ubuntu", "Chrome", "20.0.04"]
    });

    // طلب كود الاقتران تلقائياً
    if (!sock.authState.creds.registered) {
        setTimeout(async () => {
            const code = await sock.requestPairingCode("967700821174");
            console.log("\n✅ PAIRING CODE: " + code + "\n");
        }, 5000);
    }

    sock.ev.on("creds.update", saveCreds);

    sock.ev.on("connection.update", (update) => {
        const { connection } = update;
        if (connection === "open") console.log("Bot Connected Successfully!");
        if (connection === "close") startBot();
    });

    // معالج الرد التلقائي (يرد على .ping فقط حالياً للتجربة)
    sock.ev.on("messages.upsert", async (m) => {
        const msg = m.messages[0];
        if (!msg.message || msg.key.fromMe) return;
        
        const text = msg.message.conversation || msg.message.extendedTextMessage?.text;
        if (text === ".ping") {
            await sock.sendMessage(msg.key.remoteJid, { text: "Pong! البوت يعمل بنجاح 🚀" });
        }
    });
}

// سيرفر للبقاء نشطاً على ريندر
const PORT = process.env.PORT || 3000;
http.createServer((req, res) => res.end("Bot is Alive")).listen(PORT);

startBot();
