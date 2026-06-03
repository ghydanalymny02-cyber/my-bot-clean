const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');

module.exports = {
  command: "كوبرا",
  category: "edit",
  description: "عرض صورة وفيديو عن وحدة البلاك كوبرا المصرية",
  usage: ".كوبرا",

  async execute(sock, msg) {
    const chatId = msg.key.remoteJid;
    const imagePath = './resources/kubra.jpeg';
    const tiktokUrl = "https://vt.tiktok.com/ZSBa6MBJD/";
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
      // إرسال صورة البلاك كوبرا
      await sock.sendMessage(chatId, {
        image: { url: imagePath },
        caption: `🐍 *وحدة البلاك كوبرا المصرية*\n\nقوات الظل... أصحاب المهام المستحيلة\n⚡ سرعة - دقة - صمت قاتل\n\n"اختفِ قبل أن تُرى... واضرب قبل أن يُفكَّر"\n\n🇪🇬 *قوة لا تُقهر*`
      }, { quoted: msg });

      // رسالة تحميل الفيديو
      await sock.sendMessage(chatId, {
        text: `⏳ جاري تحميل العرض القتالي لوحدة البلاك كوبرا...`
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
          caption: `🎥 *عرض خاص بوحدة البلاك كوبرا المصرية*\n🇪🇬 *النخبة التي لا تُرى إلا في النصر*`
        }, { quoted: msg });

        cleanup();
      });

    } catch (err) {
      console.error("❌ خطأ في تنفيذ أمر كوبرا:", err);
      await sock.sendMessage(chatId, {
        text: "❌ حدث خطأ أثناء تنفيذ الأمر."
      }, { quoted: msg });
    }
  }
};