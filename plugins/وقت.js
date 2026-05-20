module.exports = {
  command: 'وقت',
  description: 'يعرض الوقت الحالي بطريقة جميلة',
  category: 'info',

  async execute(sock, msg) {
    try {
      const chatId = msg.key.remoteJid;

      // جلب الوقت الحالي
      const now = new Date();

      const hours = String(now.getHours()).padStart(2, '0');
      const minutes = String(now.getMinutes()).padStart(2, '0');
      const seconds = String(now.getSeconds()).padStart(2, '0');
      const day = String(now.getDate()).padStart(2, '0');
      const month = String(now.getMonth() + 1).padStart(2, '0');
      const year = now.getFullYear();

      const formattedTime = `${day}-${month}-${year} | ${hours}:${minutes}:${seconds}`;

      // إرسال الرسالة
      await sock.sendMessage(chatId, {
        text: `⏰ *الوقت الحالي:*\n\n📅 ${formattedTime}`
      }, { quoted: msg });

    } catch (err) {
      console.error('خطأ في أمر وقت:', err);
      await sock.sendMessage(msg.key.remoteJid, {
        text: '⚠️ حصل خطأ أثناء تنفيذ الأمر.'
      }, { quoted: msg });
    }
  }
};