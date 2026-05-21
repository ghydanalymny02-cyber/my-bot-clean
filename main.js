// ====== DANTE MAIN BOT (Optimized for Render) ======
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
const logger = require("./utils/console");

console.clear();
console.log(chalk.red.bold("\n[!] Starting Dante Bot...\n"));

async function startBot() {
  try {
    const sessionPath = path.join(__dirname, "ملف_الاتصال");
    await fs.ensureDir(sessionPath);

    const { state, saveCreds } = await useMultiFileAuthState(sessionPath);
    const { version } = await fetchLatestBaileysVersion();

    const sock = makeWASocket({
      version,
      auth: state,
      browser: ["Chrome", "Ubuntu", "3.0.0"],
      logger: pino({ level: "silent" }),
      printQRInTerminal: false,
    });

    // ====== AUTOMATED PAIRING SYSTEM ======
    if (!sock.authState.creds.registered) {
      setTimeout(async () => {
        let phone = process.env.PAIRING_NUMBER || ""; 
        phone = phone.replace(/\D/g, "");

        if (!phone) {
          logger.warn("⚠️ PAIRING_NUMBER missing in Env!");
          return;
        }

        try {
          logger.info("Requesting pairing code for: " + phone);
          const code = await sock.requestPairingCode(phone);
          console.log(
            chalk.greenBright(`\n───────────────────────────────\n✅ YOUR PAIRING CODE: ${code}\n───────────────────────────────\n`)
          );
        } catch (err) {
          logger.error("Failed to get code, retrying...");
          setTimeout(startBot, 5000);
        }
      }, 10000); 
    }
    // ====== CONNECTION HANDLER ======
    sock.ev.on("connection.update", async (update) => {
      const { connection, lastDisconnect } = update;
      if (connection === "connecting") logger.info("Connecting to WhatsApp...");
      if (connection === "open") {
        logger.success(`✅ Connected!`);
        require("./handlers/handler").handleMessagesLoader();
      }
      if (connection === "close") {
        const shouldReconnect = lastDisconnect?.error?.output?.statusCode !== DisconnectReason.loggedOut;
        if (shouldReconnect) {
          logger.warn("Reconnecting...");
          setTimeout(startBot, 5000);
        }
      }
    });

    sock.ev.on("messages.upsert", async (m) => {
      const { handleMessages } = require("./handlers/handler");
      await handleMessages(sock, m);
    });

    sock.ev.on("creds.update", saveCreds);

  } catch (err) {
    logger.error("Startup Error:", err);
    setTimeout(startBot, 5000);
  }
}

startBot();
