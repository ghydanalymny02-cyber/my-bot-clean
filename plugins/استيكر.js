const { downloadMediaMessage } = require('@whiskeysockets/baileys');
const fs = require('fs');
const path = require('path');
const { writeFile } = require('fs/promises');
const { execSync } = require('child_process');

module.exports = {
  command: 'استيكر',
  description: '✨ حوّل الصورة إلى استيكر بحقوق "عمك مـــجـــهـــول"',
  category: 'tools',

  async execute(sock, msg, args = []) {
    try {
      const quoted = msg.message?.extendedTextMessage?.contextInfo?.quotedMessage;
      const imageMsg = quoted?.imageMessage;

      if (!quoted || !imageMsg) {
        return sock.sendMessage(msg.key.remoteJid, {
          text: '📌 من فضلك رد على صورة علشان أقدر أعملها استيكر.'
        }, { quoted: msg });
      }

      // تحميل الصورة كـ buffer
      const mediaBuffer = await downloadMediaMessage({ message: quoted }, 'buffer');

      // حفظ مؤقت
      const tempJpg = path.join(__dirname, 'temp.jpg');
      const tempWebp = path.join(__dirname, 'temp.webp');

      await writeFile(tempJpg, mediaBuffer);

      // تحويل الصورة لـ webp باستخدام ffmpeg
      execSync(`ffmpeg -i ${tempJpg} -vcodec libwebp -filter:v fps=fps=20 -lossless 1 -qscale 75 -preset default -loop 0 -an -vsync 0 -s 512:512 ${tempWebp}`);

      // إرسال الاستيكر
      await sock.sendMessage(msg.key.remoteJid, {
        sticker: { url: tempWebp },
        packname: 'عمك مـــجـــهـــول',
        author: 'عمك مـــجـــهـــول'
      }, { quoted: msg });

      // حذف الملفات المؤقتة
      fs.unlinkSync(tempJpg);
      fs.unlinkSync(tempWebp);

    } catch (err) {
      console.error(err);
      return sock.sendMessage(msg.key.remoteJid, {
        text: `❌ حصل خطأ:\n${err.message || err.toString()}`
      }, { quoted: msg });
    }
  }
};