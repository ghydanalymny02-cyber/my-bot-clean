const { isElite } = require('../haykala/elite');
const fs = require('fs');
const path = require('path');

module.exports = {
  command: 'صورني',
  category: 'DEVELOPER',
  description: 'يرسل صورة خاصة فقط لأعضاء النخبة بدون كلام ويتفاعل معهم بإيموجي 📸',

  async execute(sock, msg, args = []) {
    const chatId = msg.key.remoteJid;
    const sender = msg.key.participant || msg.participant || msg.key.remoteJid;

    // التحقق من صلاحية النخبة
    if (!isElite(sender)) return;

    const imagePath = path.join(__dirname, '..', 'resources', 'tizk.jpg');

    // التحقق إن الصورة موجودة
    if (!fs.existsSync(imagePath)) {
      console.error('❌ الصورة غير موجودة:', imagePath);
      return;
    }

    try {
      // إرسال الصورة بدون تعليق
      await sock.sendMessage(chatId, {
        image: { url: imagePath }
      }, { quoted: msg });

      // التفاعل مع رسالة المستخدم
      await sock.sendMessage(chatId, {
        react: {
          text: '📸',
          key: msg.key
        }
      });
      
    } catch (err) {
      console.error('فشل إرسال الصورة:', err.message);
    }
  }
};