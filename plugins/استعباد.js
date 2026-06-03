module.exports = {
  command: 'عبدي',
  description: 'يرد برسالة تحت أمرك سيدي',
  category: 'fun',

  async execute(sock, msg) {
    try {
      const chatJid = msg.key.remoteJid;

      // إرسال الرد مباشرة
      await sock.sendMessage(chatJid, {
        text: 'تحت أمرك سيدي 🤵'
      }, { quoted: msg });

    } catch (err) {
      console.error("خطأ في أمر .عبدي:", err);
      await sock.sendMessage(msg.key.remoteJid, {
        text: "⚠️ حصل خطأ أثناء تنفيذ الأمر."
      }, { quoted: msg });
    }
  }
};