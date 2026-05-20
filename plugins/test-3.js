const fs = require('fs');
const path = require('path');

module.exports = {
  command: 'ريكاردو',
  description: 'اختبار أداء البوت⚙️',
  usage: '.تستا2',
  category: 'ادوات',

  async execute(sock, msg) {
    try {
      const fancyText = `𝐈'𝐌 𝐒𝐈𝐓𝐓𝐈𝐍𝐆 𝐇𝐄𝐑𝐄, 𝐌𝐘 𝐅𝐑𝐈𝐄𝐍𝐃`;

      // الصورة المصغّرة للرد
      const imagePath = path.join(__dirname, '../sounds/frind.jpg');
      const hasImage = fs.existsSync(imagePath);
      const imageBuffer = hasImage ? fs.readFileSync(imagePath) : null;

      // إرسال النص أولاً
      await sock.sendMessage(
        msg.key.remoteJid,
        {
          text: fancyText,
          contextInfo: {
            externalAdReply: {
              title: "⛥⃝𝕳𝕬𝕽𝕷𝕰𝖄༒︎",
              body: "🎀🐇ʷʰᵃᵗ ᵈᵒ ⁱ ʰᵃᵛᵉ ᵗᵒ ˢᵃʸ,𝓲𝓶 𝓳𝓾𝓼𝓽 𝓪 𝓰𝓲𝓻𝓵 𝓭𝓾𝓱.",
              thumbnail: imageBuffer,
              mediaType: 1,
              sourceUrl: "none",
              renderLargerThumbnail: false,
              showAdAttribution: true
            }
          }
        },
        { quoted: msg }
      );

      // إرسال الملصق "stek.webp" بدون ردّ
      const stickerPath = path.join(__dirname, '../sounds/stek.webp');
      if (fs.existsSync(stickerPath)) {
        const stickerBuffer = fs.readFileSync(stickerPath);
        await sock.sendMessage(
          msg.key.remoteJid,
          { sticker: stickerBuffer } // لا يوجد quoted هنا
        );
      } else {
        await sock.sendMessage(
          msg.key.remoteJid,
          { text: "⚠️ لم يتم العثور على الملصق stek.webp في مجلد sounds." },
          { quoted: msg }
        );
      }

    } catch (err) {
      await sock.sendMessage(
        msg.key.remoteJid,
        { text: `⚠️ حدث خطأ: ${err.message || err.toString()}` },
        { quoted: msg }
      );
    }
  }
};