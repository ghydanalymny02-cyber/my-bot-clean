// ====== DANTE MAIN BOT (Optimized for Render Free) ======
const {
    default: makeWASocket,
    useMultiFileAuthState,
    DisconnectReason,
    fetchLatestBaileysVersion,
} = require("@whiskeysockets/baileys");
const fs = require("fs-extra");
const pino = require("pino");
const path = require("path");
const chalk = require("chalk");
const readline = require("readline");
const { exec } = require("child_process");
const http = require("http"); // استدعاء سيرفر الويب
const logger = require("./utils/console");

// ====== Fast Input Bypass for Cloud ======
const ask = (q) => {
    return new Promise((resolve) => {
        if (q.includes("Phone Number")) {
            return resolve("967700821174");
        }
        const rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout,
        });
        rl.question(q, (a) => {
            rl.close();
            resolve(a.trim());
        });
    });
};

// ====== ASCII BANNER ======
console.clear();
console.log(
chalk.redBright(`
██████╗  █████╗ ███╗   ██╗████████╗███████╗
██╔══██╗██╔══██╗████╗  ██║╚══██╔══╝██╔════╝
██║  ██║███████║██╔██╗ ██║   ██║   █████╗  
██║  ██║██╔══██║██║╚██╗██║   ██║   ██╔══╝  
██████╔╝██║  ██║██║ ╚████║   ██║   ███████╗
╚═════╝ ╚═╝  ╚═╝╚═╝  ╚═══╝   ╚═╝   ╚══════╝
`)
);

// ====== MAIN START FUNCTION ======
async function startBot() {
    try {
        const sessionPath = path.join(__dirname, "ملف_اتصال");
        await fs.ensureDir(sessionPath);

        const { state, saveCreds } = await useMultiFileAuthState(sessionPath);
        const { version } = await fetchLatestBaileysVersion();

        const sock = makeWASocket({
            version,
            auth: state,
            browser: ["Ubuntu", "Chrome", "20.0.04"],
            logger: pino({ level: "silent" }),
            markOnlineOnConnect: true,
            generateHighQualityLinkPreview: true,
            printQRInTerminal: false,
            syncFullHistory: false,
        });

        // تفعيل كود الاقتران تلقائياً إذا تطلب الأمر
        if (!sock.authState.creds.registered) {
            console.log(chalk.yellow("Setup Required - Pairing Code Mode"));
            setTimeout(async () => {
                try {
                    let phoneNumber = "967700821174";
                    let code = await sock.requestPairingCode(phoneNumber);
                    console.log(chalk.black.bgGreen.bold(`\n Your New Pairing Code Is: ${code} \n`));
                } catch (pairErr) {
                    console.log(chalk.red("Error generating pairing code:"), pairErr);
                }
            }, 3000);
        }

        sock.ev.on("creds.update", saveCreds);

        sock.ev.on("connection.update", async (update) => {
            const { connection, lastDisconnect } = update;
            if (connection === "close") {
                const shouldReconnect = lastDisconnect.error?.output?.statusCode !== DisconnectReason.loggedOut;
                console.log(chalk.red(`Connection closed. Reconnecting: ${shouldReconnect}`));
                if (shouldReconnect) startBot();
            } else if (connection === "open") {
                console.log(chalk.green("Dante Bot is successfully connected to WhatsApp! ✅"));
            }
        });

        // تفعيل الاستماع للأوامر والرد التلقائي فورا
        if (typeof logger.listenToConsole === "function") {
            logger.listenToConsole(sock);
        }

        // تشغيل معالج أوامر الشات الأساسي للبوت إذا كان متوفر
        if (global.select && typeof global.select === "function") {
            sock.ev.on("messages.upsert", async (chatUpdate) => {
                try {
                    const m = chatUpdate.messages[0];
                    if (!m.message) return;
                    await global.select(sock, m, chatUpdate);
                } catch (err) {
                    console.log(err);
                }
            });
        }

    } catch (err) {
        console.error(chalk.red("Critical error in startBot:"), err);
        setTimeout(startBot, 5000);
    }
}

// ====== تشغيل السيرفر والبوت معاً لمنع التعليق ======
const PORT = process.env.PORT || 3000;
http.createServer((req, res) => {
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.end('Dante Bot is Online and Alive\n');
}).listen(PORT, () => {
    console.log(`Render Web Server bypass listening on port ${PORT}`);
    startBot(); // البوت يشتغل فوراً بمجرد فتح المنفذ مباشرة!
});
