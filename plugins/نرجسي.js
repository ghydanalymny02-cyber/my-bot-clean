const fs = require('fs');
const path = require('path');

module.exports = {
  command: ['نرجسي'],
  description: '😎 صورة + كلام نرجسي + صوت',
  category: 'ترفيه',

  async execute(sock, msg) {
    try {
      const imagePath = path.join(__dirname, '..', 'resources', 'narcissist.jpg');
      const audioPath = path.join(__dirname, '..', 'sounds', 'IN.mp3');

      // تحقق من وجود الملفات
      if (!fs.existsSync(imagePath) || !fs.existsSync(audioPath)) {
        await sock.sendMessage(msg.key.remoteJid, {
          text: '❌ تأكد من وجود الملفات التالية داخل مجلد media:\n- narcissist.jpg\n- narcissist.mp3',
        }, { quoted: msg });
        return;
      }

      const imageBuffer = fs.readFileSync(imagePath);
      const audioBuffer = fs.readFileSync(audioPath);

      // إرسال الصورة مع كلام نرجسي
      await sock.sendMessage(msg.key.remoteJid, {
        image: imageBuffer,
        caption: `😎🔥

*أنا مش مغرور...*
*أنا مجرد شخص أدرك قيمته قبل ما العالم يحاول يقلل منها.*

👑 *أنا النرجسي اللي حب نفسه... فالعالم اتجنن.*

`,
      }, { quoted: msg });

      // إرسال الصوت بعده
      await sock.sendMessage(msg.key.remoteJid, {
        audio: audioBuffer,
        mimetype: 'audio/mp4',
        ptt: true
      }, { quoted: msg });

    } catch (err) {
      console.error('🚫 خطأ في أمر نرجسي:', err);
      await sock.sendMessage(msg.key.remoteJid, {
        text: '⚠️ حصل خطأ أثناء تنفيذ الأمر.',
      }, { quoted: msg });
    }
  }
};