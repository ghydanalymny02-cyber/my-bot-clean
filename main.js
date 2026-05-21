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
const { exec } = require("child_process");
const logger = require("./utils/console");

// ====== ASCII BANNER ======
console.clear();
console.log(
  chalk.redBright(`
██████╗   █████╗  ███╗   ██╗ ████████╗ ███████╗
██╔══██╗ ██╔══██╗ ████╗  ██║ ╚══██╔══╝ ██╔════╝
██║  ██║ ███████║ ██╔██╗ ██║    ██║    █████╗  
██║  ██║ ██╔══██║ ██║╚██╗██║    ██║    ██╔══╝  
██████╔╝ ██║  ██║ ██║ ╚████║    ██║    ███████╗
╚═════╝  ╚═╝  ╚═╝ ╚═╝  ╚═══╝    ╚═╝    ╚══════╝
`)
);
console.log(chalk.red.bold("\nDante is now running on Render...\n"));

// ====== MAIN START FUNCTION ======
async function startBot() {
  try {
    const sessionPath = path.join(__dirname, "ملف_الاتصال");
    await fs.ensureDir(sessionPath);

    const { state, saveCreds } = await useMultiFileAuthState(sessionPath);
    const { version } = await fetchLatestBaileysVersion();

    const sock = makeWASocket({
      version,
      auth: state,
      browser: ["Render", "Chrome", "1.0.0"],
      logger: pino({ level: "silent" }),
      markOnlineOnConnect: true,
      generateHighQualityLinkPreview: true,
      printQRInTerminal: false,
      syncFullHistory: false,
    });

    // ====== AUTOMATED PAIRING SYSTEM ======
    if (!sock.authState.creds.registered) {
      let phone = process.env.PAIRING_NUMBER || ""; 
      phone = phone.replace(/\D/g, "");

      if (!phone) {
        logger.warn("⚠️ PAIRING_NUMBER not found in Environment. Please add it in Render Settings.");
      } else {
        try {
          logger.info("Requesting pairing code for: " + phone);
          const code = await sock.requestPairingCode(phone);
          console.log(
            chalk.greenBright(
              `\n───────────────\n✅ YOUR PAIRING CODE: ${code}\n───────────────\n`
            )
          );
        } catch (err) {
          logger.error("Failed to get pairing code:", err.message);
        }
      }
    }

    // ====== CONNECTION STATUS ======
    sock.ev.on("connection.update", async (update) => {
      const { connection, lastDisconnect } = update;

      if (connection === "connecting") logger.info("Connecting to WhatsApp...");

      if (connection === "open") {
        logger.success(`✅ Connected as ${sock.user.id}`);
        require("./handlers/handler").handleMessagesLoader();
      }

      if (connection === "close") {
        const reason = lastDisconnect?.error?.output?.statusCode === DisconnectReason.loggedOut;
        logger.warn("Connection closed, reconnecting...");
        if (!reason) setTimeout(startBot, 3000);
      }
    });

    // ====== MESSAGE HANDLER ======
    sock.ev.on("messages.upsert", async (m) => {
      try {
        const { handleMessages } = require("./handlers/handler");
        await handleMessages(sock, m);
      } catch (e) {
        logger.error("Message error:", e);
      }
    });

    sock.ev.on("creds.update", saveCreds);
  } catch (err) {
    logger.error("Startup Error:", err);
    setTimeout(startBot, 3000);
  }
}

// ====== START ======
startBot();
