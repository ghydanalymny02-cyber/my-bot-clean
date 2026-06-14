const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');

module.exports = {
  command: "قوات",
  category: "edit",
  description: "عرض صورة وفيديو عن الجيش المصري",
  usage: ".قوات",

  async execute(sock, msg) {
    const chatId = msg.key.remoteJid;
    const imagePath = './resources/geh.jpeg';
    const tiktokUrl = "https://vt.tiktok.com/ZSBajA67N/";
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
      // إرسال صورة الجيش
      await sock.sendMessage(chatId, {
        image: { url: imagePath },
        caption: `🪖 *الجيش المصري - قواتنا المسلحة*\n\nدرع الوطن وسيفه.\n\n*خير أجناد الأرض 🇪🇬*`
      }, { quoted: msg });

      // رسالة تحميل الفيديو
      await sock.sendMessage(chatId, {
        text: `⏳ جاري تحميل العرض العسكري...`
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
          caption: `🎥 *عرض عسكري من قواتنا المسلحة*\n🇪🇬 *تحيا مصر*`
        }, { quoted: msg });

        cleanup();
      });

    } catch (err) {
      console.error("❌ خطأ في تنفيذ الأمر:", err);
      await sock.sendMessage(chatId, {
        text: "❌ حدث خطأ أثناء تنفيذ الأمر."
      }, { quoted: msg });
    }
  }
};