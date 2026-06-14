const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');

module.exports = {
  command: "مصر",
  category: "edit",
  description: "عرض صورة علم مصر وفيديو وطني عشوائي",
  usage: ".مصر",

  async execute(sock, msg) {
    const chatId = msg.key.remoteJid;
    const imagePath = './resources/msr.jpg';

    const tiktokUrls = [
      "https://vt.tiktok.com/ZSBmB7FYe/",
      "https://vt.tiktok.com/ZSBmBWx24/",
      "https://vt.tiktok.com/ZSBmSJ42K/"
    ];

    const selectedUrl = tiktokUrls[Math.floor(Math.random() * tiktokUrls.length)];
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
      // إرسال علم مصر
      await sock.sendMessage(chatId, {
        image: { url: imagePath },
        caption: `🇪🇬 *مصر أم الدنيا... ومهد الحضارة.*\n\n*تحيا مصر ✌️🇪🇬*`
      }, { quoted: msg });

      // رسالة تحميل
      await sock.sendMessage(chatId, {
        text: `⏳ جاري تحميل فيديو وطني...`
      }, { quoted: msg });

      // تحميل الفيديو من TikTok
      exec(`yt-dlp -f best -o "${videoPath}" "${selectedUrl}"`, async (errDownload) => {
        if (errDownload || !fs.existsSync(videoPath)) {
          console.error('[ERROR] تحميل الفيديو:', errDownload?.message);
          cleanup();
          return await sock.sendMessage(chatId, {
            text: `❌ فشل تحميل الفيديو الوطني.`
          }, { quoted: msg });
        }

        // إرسال الفيديو
        await sock.sendMessage(chatId, {
          video: { url: videoPath },
          caption: `🎥 *مقطع وطني من أرض الكنانة*\n🇪🇬 *مصر المجد والعزة*`
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