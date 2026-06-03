const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');

module.exports = {
  command: "روسيا",
  description: "عرض صورة وفيديو مشترك للسيسي وبوتين ضمن الحلف",
  category: "edit",
  usage: ".روسيا",

  async execute(sock, msg) {
    const chatId = msg.key.remoteJid;
    const imagePath = './resources/rosya.jpg';
    const videoUrls = [
      "https://vt.tiktok.com/ZSBmrGgHc/",
      "https://vt.tiktok.com/ZSBmh8mUu/"
    ];
    const chosenVideo = videoUrls[Math.floor(Math.random() * videoUrls.length)];
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
      // إرسال الصورة
      await sock.sendMessage(chatId, {
        image: { url: imagePath },
        caption: `🤝 *التحالف العالمي الجديد*\n\n🇪🇬 الرئيس *عبد الفتاح السيسي* 🇷🇺 والرئيس *فلاديمير بوتين*\n\nقادة التاريخ وصُنّاع القرار، يجمعهم الحلم المشترك في تأسيس نظام عالمي متعدد الأقطاب.\n\n🌍 *تحالف يُرعب الأعداء... ويصنع التوازن.*`
      }, { quoted: msg });

      // تحميل الفيديو
      await sock.sendMessage(chatId, {
        text: `⏳ جاري تحميل مقطع التحالف...`
      }, { quoted: msg });

      exec(`yt-dlp -f best -o "${videoPath}" "${chosenVideo}"`, async (errDownload) => {
        if (errDownload || !fs.existsSync(videoPath)) {
          console.error('[ERROR] تحميل الفيديو:', errDownload?.message);
          cleanup();
          return await sock.sendMessage(chatId, {
            text: `❌ فشل تحميل الفيديو.`
          }, { quoted: msg });
        }

        await sock.sendMessage(chatId, {
          video: { url: videoPath },
          caption: `🎥 *لقطات نادرة من التنسيق بين القاهرة وموسكو*\n🇷🇺🇪🇬 *التحالف الذي لا يُهزم*`
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