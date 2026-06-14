const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');

module.exports = {
  command: "نسور",
  category: "edit",
  description: "عرض صورة وفيديو عن القوات الجوية المصرية",
  usage: ".نسر",

  async execute(sock, msg) {
    const chatId = msg.key.remoteJid;
    const imagePath = './resources/tayran.jpeg';
    const tiktokUrl = "https://vt.tiktok.com/ZSBa2GnEa/";
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
      // إرسال صورة الطيران الحربي
      await sock.sendMessage(chatId, {
        image: { url: imagePath },
        caption: `🛩️ *القوات الجوية المصرية*\n\nنسور تحمي سماء الوطن.\n\n*قوة لا تُقهَر ✈️🇪🇬*`
      }, { quoted: msg });

      // رسالة تحميل
      await sock.sendMessage(chatId, {
        text: `⏳ جاري تحميل العرض الجوي...`
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
          caption: `🎥 *عرض جوي من نسور القوات المسلحة*\n🇪🇬 *تحيا مصر*`
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