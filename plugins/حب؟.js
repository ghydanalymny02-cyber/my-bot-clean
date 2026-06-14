const loveSessions = new Map(); // تخزين الحالات لكل شات

module.exports = {
  command: 'مين',
  description: 'يرد مين حبني؟',
  category: 'مرح',

  async execute(sock, msg) {
    try {
      const chatId = msg.key.remoteJid;

      // تفعيل الحالة
      loveSessions.set(chatId, true);

      await sock.sendMessage(chatId, {
        text: "😳 مين حبني؟ اسيل تدبحكم.               مـــجـــهـــول⊰𝑩𝑶𝑻 "
      }, { quoted: msg });

    } catch (e) {
      console.error("خطأ في أمر اتحبيت:", e);
    }
  }
};

// نصدر عشان دي.js يعرف يقرأه
module.exports.loveSessions = loveSessions;