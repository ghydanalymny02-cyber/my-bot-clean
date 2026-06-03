const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');

module.exports = {
  command: "حلفاء",
  category: "edit",
  description: "عرض صورة وفيديو عن حلف السيسي وبوتين ورئيس الصين",
  usage: ".حلفاء",

  async execute(sock, msg) {
    const chatId = msg.key.remoteJid;
    const imagePath = './resources/hlef.jpg';
    const tiktokUrl = "https://vt.tiktok.com/ZSBm6K4Bj/";
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
      // إرسال صورة الحلفاء
      if (fs.existsSync(imagePath)) {
        await sock.sendMessage(chatId, {
          image: { url: imagePath },
          caption: `🌐 *الحلفاء العظماء*\n\n👑 *السيسي* - رئيس الحلف\n🪖 *بوتين* - قائد روسيا\n🧠 *رئيس الصين* - ضمن التحالف\n\n✊ تحالف لا يُهزم!`
        }, { quoted: msg });
      }

      // رسالة تحميل الفيديو
      await sock.sendMessage(chatId, {
        text: `⏳ جاري تحميل فيديو الحلف...`
      }, { quoted: msg });

      // تحميل فيديو TikTok
      exec(`yt-dlp -f best -o "${videoPath}" "${tiktokUrl}"`, async (errDownload) => {
        if (errDownload || !fs.existsSync(videoPath)) {
          console.error('[ERROR] تحميل الفيديو:', errDownload?.message);
          cleanup();
          return await sock.sendMessage(chatId, {
            text: `❌ فشل تحميل فيديو الحلف.`
          }, { quoted: msg });
        }

        // إرسال الفيديو
        await sock.sendMessage(chatId, {
          video: { url: videoPath },
          caption: `🎥 *مقطع خاص بالحلف العظيم*\nالسيسي - بوتين - رئيس الصين\n🔥 وحدة لا تُقهر!`
        }, { quoted: msg });

        cleanup();
      });

    } catch (err) {
      console.error("❌ خطأ في تنفيذ أمر الحلفاء:", err);
      await sock.sendMessage(chatId, {
        text: "❌ حدث خطأ أثناء تنفيذ أمر الحلفاء."
      }, { quoted: msg });
    }
  }
};