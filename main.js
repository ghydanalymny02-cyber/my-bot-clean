// ====== DANTE MAIN BOT (Optimized & Fixed for Render) ======
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
const http = require("http");
const logger = require("./utils/console");
const { handleMessages } = require("./handlers/handler"); // استيراد مباشر للمعالج

// ====== ASCII BANNER ======
console.clear();
console.log(chalk.redBright(`
██████╗  █████╗ ███╗   ██╗████████╗███████╗
██╔══██╗██╔══██╗████╗  ██║╚══██╔══╝██╔════╝
██║  ██║███████║██╔██╗ ██║   ██║   █████╗  
██║  ██║██╔══██║██║╚██╗██║   ██║   ██╔══╝  
██████╔╝██║  ██║██║ ╚████║   ██║   ███████╗
╚═════╝ ╚═╝  ╚═╝╚═╝  ╚═══╝   ╚═╝   ╚══════╝
`));

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

        // ====== AUTOMATED PAIRING ======
        if (!sock.authState.creds.registered) {
            setTimeout(async () => {
                try {
                    let phoneNumber = "967700821174";
                    let code = await sock.requestPairingCode(phoneNumber);
                    console.log(chalk.black.bgGreen.bold(`\n YOUR NEW PAIRING CODE IS: ${code} \n`));
                } catch (pairErr) {
                    console.log(chalk.red("Error generating code:"), pairErr);
                }
            }, 3000);
        }

        sock.ev.on("creds.update", saveCreds);

        // ====== CONNECTION HANDLER ======
        sock.ev.on("connection.update", async (update) => {
            const { connection, lastDisconnect } = update;
            if (connection === "close") {
                const shouldReconnect = lastDisconnect.error?.output?.statusCode !== DisconnectReason.loggedOut;
                if (shouldReconnect) startBot();
            } else if (connection === "open") {
                console.log(chalk.green("Dante Bot is connected and ready to reply! ✅"));
            }
        });

        // ====== DIRECT MESSAGE HANDLER ======
        sock.ev.on("messages.upsert", async (chatUpdate) => {
            try {
                const m = chatUpdate.messages[0];
                if (!m.message) return;
                await handleMessages(sock, m); // الاستدعاء المباشر للمعالج
            } catch (err) {
                console.log(chalk.red("Handler Error: "), err);
            }
        });

    } catch (err) {
        console.error(chalk.red("Critical error:"), err);
        setTimeout(startBot, 5000);
    }
}

// ====== WEB SERVER BYPASS ======
const PORT = process.env.PORT || 3000;
http.createServer((req, res) => {
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.end('Dante Bot is Online');
}).listen(PORT, () => {
    console.log(`Bypass server running on port ${PORT}`);
    startBot();
});
