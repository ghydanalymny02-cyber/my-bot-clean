const fs = require("fs");
const { eliteNumbers } = require('../haykala/elite.js'); // استيراد النخبة

module.exports = {
  command: ['اسم'],
  description: 'تغيير اسم الجروب (للنخبة فقط).',
  category: 'DEVELOPER',

  async execute(sock, msg, args = []) {
    try {
      // التحقق أن الأمر داخل جروب
      if (!msg.key.remoteJid.endsWith('@g.us')) {
        return await sock.sendMessage(msg.key.remoteJid, {
          text: '🚫 هذا الأمر يعمل داخل المجموعات فقط.'
        }, { quoted: msg });
      }

      // التحقق من رقم المرسل
      const sender = msg.key.participant || msg.key.remoteJid;
      const senderNumber = sender.split('@')[0];
      if (!eliteNumbers.includes(senderNumber)) {
        return await sock.sendMessage(msg.key.remoteJid, {
          text: '❌ هذا الأمر مخصص للنخبة فقط.'
        }, { quoted: msg });
      }

      // جلب بيانات الجروب
      const groupMetadata = await sock.groupMetadata(msg.key.remoteJid);

      // قراءة النص الكامل من الرسالة (مش بس args)
      const fullText =
        msg.message?.conversation ||
        msg.message?.extendedTextMessage?.text ||
        '';

      // استخراج الاسم الجديد (بعد الأمر "اسم")
      const parts = fullText.trim().split(/\s+/);
      parts.shift(); // إزالة الأمر نفسه من النص
      const newName = parts.join(' ').trim();

      if (!newName) {
        return await sock.sendMessage(msg.key.remoteJid, {
          text: '⚠️ يرجى كتابة الاسم الجديد بعد الأمر.'
        }, { quoted: msg });
      }

      const oldName = groupMetadata.subject;
      await sock.groupUpdateSubject(msg.key.remoteJid, newName);

      const messageText = `> تــم تغيير اسم الجروب من *${oldName}* الي *${newName}*... 🍡`;

      // قراءة الصورة المصغرة
      const imagePath = "image.jpeg";
      const hasImage = fs.existsSync(imagePath);
      const imageBuffer = hasImage ? fs.readFileSync(imagePath) : null;

      await sock.sendMessage(
        msg.key.remoteJid,
        {
          text: messageText,
          contextInfo: {
            externalAdReply: {
              title: "❄ مـــجـــهـــول 𝑩𝒐𝒕꧂",
              body: "تم تغيير اسم الجروب بنجاح 🎉",
              thumbnail: imageBuffer,
              mediaType: 1,
              sourceUrl: "https://t.me/",
              renderLargerThumbnail: false,
              showAdAttribution: true
            }
          }
        },
        { quoted: msg }
      );

    } catch (error) {
      console.error('*ارفـــعــني ادمـــن وهشـــتغل لــوحدي🍓*', error);
    }
  }
};