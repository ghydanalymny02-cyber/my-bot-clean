const fs = require("fs");
const path = require("path");
const { eliteNumbers } = require("../haykala/elite.js"); // ملف النخبة

const tmpDir = path.join(process.cwd(), "tmp/media");

module.exports = {
  command: ['ابعتها'],
  description: 'يبعت الوسائط اللي اتحفظت بـ .tmp (للنخبة بس)',
  category: 'DEVELOPER',

  async execute(sock, msg) {
    const sender = msg.key.participant || msg.key.remoteJid; 
    const chatId = msg.key.remoteJid;

    // تأكيد إن اللي بيستخدم الأمر نخبة
    if (!eliteNumbers.includes(sender.split("@")[0])) {
      await sock.sendMessage(chatId, { text: "🚫 الأمر ده للنخبة بس يسطا." });
      return;
    }

    // شوف لو في ملفات
    if (!fs.existsSync(tmpDir)) {
      await sock.sendMessage(chatId, { text: "📂 مفيش أي حاجة متخزنة." });
      return;
    }

    const files = fs.readdirSync(tmpDir);
    if (!files.length) {
      await sock.sendMessage(chatId, { text: "📂 مفيش أي حاجة متخزنة." });
      return;
    }

    // بعت كل الملفات
    for (let file of files) {
      const filePath = path.join(tmpDir, file);
      const buffer = fs.readFileSync(filePath);

      if (file.endsWith(".jpg") || file.endsWith(".png")) {
        await sock.sendMessage(chatId, { image: buffer });
      } else if (file.endsWith(".mp4")) {
        await sock.sendMessage(chatId, { video: buffer });
      } else if (file.endsWith(".mp3") || file.endsWith(".ogg")) {
        await sock.sendMessage(chatId, { audio: buffer, mimetype: "audio/mpeg" });
      }
    }

    // امسح الملفات بعد الإرسال
    files.forEach(file => fs.unlinkSync(path.join(tmpDir, file)));

    // رسالة تأكيد
    await sock.sendMessage(chatId, { text: `✅ اتبعت ${files.length} ملف/وسائط بنجاح.` });
  }
};