// ====== DANTE MAIN BOT (Optimized & Stable) ======
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
const logger = require("./utils/console");

// ====== Fast Input ======
const ask = (q) =>
  new Promise((resolve) => {
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });
    rl.question(q, (a) => {
      rl.close();
      resolve(a.trim());
    });
  });

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
console.log(chalk.red.bold("\nDante is now running...\n"));

// ====== SOUND CONTROL ======
function playSound(file) {
  const control = path.join(__dirname, "sounds", "sound.txt");
  if (!fs.existsSync(control)) return;
  if (fs.readFileSync(control, "utf-8").trim() !== "{on}") return;

  const soundPath = path.join(__dirname, "sounds", file);
  if (fs.existsSync(soundPath)) exec(`mpv --no-terminal "${soundPath}"`);
}

// ====== MAIN START FUNCTION ======
async function startBot() {
  try {
    playSound("MILIO.mp3");

    const sessionPath = path.join(__dirname, "ملف_الاتصال");
    await fs.ensureDir(sessionPath);

    const { state, saveCreds } = await useMultiFileAuthState(sessionPath);
    const { version } = await fetchLatestBaileysVersion();

    const sock = makeWASocket({
      version,
      auth: state,
      browser: ["MacOS", "Chrome", "1.0.0"],
      logger: pino({ level: "silent" }),
      markOnlineOnConnect: true,
      generateHighQualityLinkPreview: true,
      printQRInTerminal: false,
      syncFullHistory: false,
    });

    // ====== Auto Group Data Cache ======
    sock.ev.on("groups.upsert", async (groups) => {
      for (const g of groups) {
        try {
          await sock.groupMetadata(g.id);
          logger.info(`Loaded group: ${g.subject}`);
        } catch {
          logger.warn(`Failed to load group: ${g.id}`);
        }
      }
    });

    // ====== PAIRING SYSTEM ======
    if (!sock.authState.creds.registered) {
      console.log(chalk.yellow("\nSetup Required — Pairing Code Mode\n"));
      
      // تم تثبيت رقمك هنا مباشرة لمنع توقف السيرفر على Render
      let phone = "967717579146"; 
      phone = phone.replace(/\D/g, "");

      if (!/^\d{10,15}$/.test(phone)) {
        logger.error("❌ Invalid phone number.");
        return process.exit(1);
      }

      try {
        logger.info("Fetching pairing code...");
        const code = await sock.requestPairingCode(phone);
        console.log(
          chalk.greenBright(
            `\n───────────────\nPairing Code: ${code}\nPhone: ${phone}\n───────────────\n`
          )
        );
      } catch (err) {
        logger.error("Failed to get pairing code:", err.message);
        sock.printQRInTerminal = true;
      }
    }

    // ====== CONNECTION STATUS ======
    sock.ev.on("connection.update", async (update) => {
      const { connection, lastDisconnect } = update;

      if (connection === "connecting") logger.info("Connecting to WhatsApp...");

      if (connection === "open") {
        logger.success(`✅ Connected as ${sock.user.id}`);
        try {
          const { addEliteNumber } = require("./haykala/elite");
          const botNumber = sock.user.id.split(":")[0].replace(/\D/g, "");
          const [info] = await sock.onWhatsApp(`${botNumber}@s.whatsapp.net`);
          const lid = info?.lid?.replace(/\D/g, "");

          if (botNumber && lid) {
            await Promise.all([addEliteNumber(botNumber), addEliteNumber(lid)]);
            logger.info(`Elite sync complete for ${botNumber}/${lid}`);
          }
        } catch (e) {
          logger.warn("Elite registration failed:", e.message);
        }

       // require("./handlers/handler").handleMessagesLoader();
        listenToConsole();
      }

      if (connection === "close") {
        const reason =
          lastDisconnect?.error?.output?.statusCode ===
          DisconnectReason.loggedOut;
        logger.warn("Connection closed:", lastDisconnect?.error?.message || "");
        playSound("LOGGOUT.mp3");

        if (reason) {
          logger.error("Logged out — restarting not possible.");
          process.exit(1);
        } else {
          logger.info("Reconnecting in 3s...");
          setTimeout(startBot, 3000);
        }
      }
    });

    // ====== MESSAGE HANDLER ======
    sock.ev.on("messages.upsert", async (m) => {
      try {
        const { handleMessages } = require("./handlers/handler");
        await handleMessages(sock, m);
      } catch (e) {
        logger.error("Message error:", e);
        playSound("ERROR.mp3");
      }
    });

    // ====== SAVE CREDENTIALS ======
    sock.ev.on("creds.update", saveCreds);
  } catch (err) {
    logger.error("Startup Error:", err);
    playSound("ERROR.mp3");
    setTimeout(startBot, 3000);
  }
}

// ====== CONSOLE LISTENER ======
function listenToConsole() {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  rl.on("line", () => logger.info("[CMD] Unknown command."));
}

// ====== START ======
startBot();
