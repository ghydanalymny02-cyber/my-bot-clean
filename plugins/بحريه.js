const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');

module.exports = {
  command: "بحريه",
  description: "عرض صورة وفيديو عن القوات البحرية المصرية",
  usage: ".بحريه",
  category: "edit",

  async execute(sock, msg) {
    const chatId = msg.key.remoteJid;
    const imagePath = './resources/bhr.jpeg';
    const tiktokUrl = "https://vt.tiktok.com/ZSBajD8BJ/";
    const timestamp = Date.now();
    const tempDir = './temp';

    if (!fs.existsSync(tempDir)) fs.mkdirSync(tempDir, { recursive: true });
    const videoPath = path.join(tempDir, `${timestamp}.mp4`);

    const cleanup = () => {
      if (fs.existsSync(videoPath)) {
        fs.unlink(videoPath, (err) => {
          if (err) console.error(`فشل حذف الفيديو:`, err.message);
        });
      }
    };

    try {
      // إرسال صورة القوات البحرية
      await sock.sendMessage(chatId, {
        image: { url: imagePath },
        caption: `⚓ *القوات البحرية اليمنية*\n\nدرع اليمن في البحر، وسيفها في الأعماق.\n\n"نحمي السواحل بكل حزم وقوة"\n\n🇾🇪 *تحيا اليمن*`
      }, { quoted: msg });

      // رسالة تحميل الفيديو
      await sock.sendMessage(chatId, {
        text: `⏳ جاري تحميل العرض البحري...`
      }, { quoted: msg });

      // تحميل الفيديو من TikTok
      exec(`yt-dlp -f best -o "${videoPath}" "${tiktokUrl}"`, async (errDownload) => {
        if (errDownload || !fs.existsSync(videoPath)) {
          console.error('[ERROR] تحميل الفيديو:', errDownload?.message);
          cleanup();
          return await sock.sendMessage(chatId, {
            text: `❌ فشل تحميل الفيديو.`
          }, { quoted: msg });
        }

        // إرسال الفيديو
        await sock.sendMessage(chatId, {
          video: { url: videoPath },
          caption: `🎥 *عرض من أعماق البحر لقواتنا البحرية*\n🇾🇪 *تحيا اليمن*`
        }, { quoted: msg });

        cleanup();
      });

    } catch (err) {
      console.error("❌ خطأ في تنفيذ أمر بحرية:", err);
      await sock.sendMessage(chatId, {
        text: "❌ حدث خطأ أثناء تنفيذ الأمر."
      }, { quoted: msg });
    }
  }
};