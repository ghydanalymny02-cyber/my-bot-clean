const fs = require('fs');
const path = require('path');
const { downloadMediaMessage } = require('@whiskeysockets/baileys');

module.exports = {
  command: ['لملصق',],
  description: 'تحويل الصورة إلى ملصق واتساب WebP مع إضافة الحقوق في وصف الملصق',
  category: 'الميديا',

  async execute(sock, msg) {
    try {
      const quoted = msg.message?.extendedTextMessage?.contextInfo?.quotedMessage;
      if (!quoted || !quoted.imageMessage) {
        return sock.sendMessage(msg.key.remoteJid, { text: "📸 أرسل هذا الأمر كردّ على صورة لتحويلها إلى ملصق." });
      }

      const tempDir = path.join(__dirname, 'temp');
      if (!fs.existsSync(tempDir)) fs.mkdirSync(tempDir, { recursive: true });

      // تنزيل الصورة
      const buffer = await downloadMediaMessage(
        { message: quoted },
        'buffer',
        {},
        { reuploadRequest: sock.updateMediaMessage }
      );

      const inputPath = path.join(tempDir, `image_${Date.now()}.jpg`);
      const outputPath = path.join(tempDir, `sticker_${Date.now()}.webp`);
      fs.writeFileSync(inputPath, buffer);

      await sock.sendMessage(msg.key.remoteJid, { text: "🔄 جاري تحويل الصورة إلى ملصق..." });

      // تحويل الصورة إلى ملصق WebP
      const execSync = require('child_process').execSync;
      execSync(
        `ffmpeg -y -i "${inputPath}" -vcodec libwebp -filter:v "scale=512:512:force_original_aspect_ratio=decrease" -lossless 1 -loop 0 -preset default -an -vsync 0 "${outputPath}"`,
        { stdio: 'ignore' }
      );

      // إرسال الملصق مع وصف الحقوق
      await sock.sendMessage(msg.key.remoteJid, {
        sticker: fs.readFileSync(outputPath),
        caption: "حقوق🌋مـــجـــهـــول"
      });

      fs.unlinkSync(inputPath);
      fs.unlinkSync(outputPath);

    } catch (err) {
      console.error("❌ حدث خطأ أثناء تحويل الصورة إلى ملصق:", err);
      await sock.sendMessage(msg.key.remoteJid, { text: "⚠️ حدث خطأ أثناء تحويل الصورة إلى ملصق." });
    }
  },
};