const { downloadContentFromMessage } = require('@whiskeysockets/baileys');
const fs = require("fs");
const path = require("path");
const { eliteNumbers } = require("../haykala/elite.js"); // ملف النخبة

const tmpDir = path.join(process.cwd(), "tmp/media");
if (!fs.existsSync(tmpDir)) fs.mkdirSync(tmpDir, { recursive: true });

async function saveMediaMessage(quoted, fileName, type) {
  const stream = await downloadContentFromMessage(
    quoted[`${type}Message`],
    type
  );

  let buffer = Buffer.from([]);
  for await (const chunk of stream) {
    buffer = Buffer.concat([buffer, chunk]);
  }

  fs.writeFileSync(fileName, buffer);
  return buffer;
}

module.exports = {
  command: ['احفظها'],
  description: 'يحفظ الميديا (صورة / فيديو / صوت) اللي عامل عليها ريبلاي (للنخبة بس)',
  category: 'DEVELOPER',

  async execute(sock, msg) {
    const chatId = msg.key.remoteJid;
    const sender = msg.key.participant || msg.key.remoteJid;

    // تأكيد إن اللي بيستخدم الأمر نخبة
    if (!eliteNumbers.includes(sender.split("@")[0])) {
      await sock.sendMessage(chatId, { text: "🚫 الأمر ده للنخبة بس يسطا." });
      return;
    }

    // لازم يكون في ريبلاي
    if (!msg.message?.extendedTextMessage?.contextInfo?.quotedMessage) {
      await sock.sendMessage(chatId, { text: "❌ لازم تعمل ريبلاي على صورة، فيديو أو صوت." });
      return;
    }

    const quoted = msg.message.extendedTextMessage.contextInfo.quotedMessage;

    let fileName, type;

    if (quoted.imageMessage) {
      type = "image";
      fileName = path.join(tmpDir, Date.now() + ".jpg");
    } else if (quoted.videoMessage) {
      type = "video";
      fileName = path.join(tmpDir, Date.now() + ".mp4");
    } else if (quoted.audioMessage) {
      type = "audio";
      fileName = path.join(tmpDir, Date.now() + ".mp3");
    } else {
      await sock.sendMessage(chatId, { text: "❌ الميديا دي مش صورة ولا فيديو ولا صوت." });
      return;
    }

    await saveMediaMessage(quoted, fileName, type);
    await sock.sendMessage(chatId, { text: `✅ اتحفظت الميديا: ${path.basename(fileName)}` });
  }
};