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
        browser: ["Ubuntu", "Chrome", "20.0.04"],
        printQRInTerminal: false
    });

    // طلب الكود فقط إذا لم يكن البوت مرتبطاً بالفعل
    if (!sock.authState.creds.registered) {
        setTimeout(async () => {
            try {
                // نستخدم رقمك الموجود في البيئة
                const phoneNumber = process.env.PAIRING_NUMBER || "967700821174";
                const code = await sock.requestPairingCode(phoneNumber.replace(/[^0-9]/g, ''));
                console.log("\n=================================");
                console.log("✅ COPY THIS CODE: " + code);
                console.log("=================================\n");
            } catch (err) {
                console.log("Error requesting code, please restart.");
            }
        }, 5000); // انتظر 5 ثواني لضمان استقرار الاتصال قبل طلب الكود
    }

    sock.ev.on("creds.update", saveCreds);

    sock.ev.on("connection.update", (update) => {
        const { connection, lastDisconnect } = update;
        if (connection === "open") console.log("✅ Bot is connected!");
        if (connection === "close") {
            const shouldReconnect = lastDisconnect?.error?.output?.statusCode !== DisconnectReason.loggedOut;
            if (shouldReconnect) startBot();
        }
    });

    sock.ev.on("messages.upsert", async (m) => {
        const msg = m.messages[0];
        if (!msg.message || msg.key.fromMe) return;
        const text = msg.message.conversation || msg.message.extendedTextMessage?.text;
        if (text === ".ping") {
            await sock.sendMessage(msg.key.remoteJid, { text: "Pong! 🚀" });
        }
    });
}

// سيرفر للبقاء نشطاً
const PORT = process.env.PORT || 3000;
http.createServer((req, res) => res.end("Bot is Alive")).listen(PORT);

startBot();
