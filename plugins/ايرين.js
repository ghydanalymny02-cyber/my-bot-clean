const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');

module.exports = {
  command: "يوميلا",
  description: "ايديت انمي لإيرين ييغر",
  category: "edit",
  usage: ".يوميلا",

  async execute(sock, msg) {
    const chatId = msg.key.remoteJid;
    const tiktokUrl = "https://vt.tiktok.com/ZSBQ2VvvR/";
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
      await sock.sendMessage(chatId, {
        text: `📤 جاري إرسال الايديت الخاص بـ *إيرين ييغر*...`
      }, { quoted: msg });

      exec(`yt-dlp -f best -o "${videoPath}" "${tiktokUrl}"`, async (errDownload) => {
        if (errDownload || !fs.existsSync(videoPath)) {
          console.error('[ERROR] تحميل الفيديو:', errDownload?.message);
          cleanup();
          return await sock.sendMessage(chatId, {
            text: `❌ فشل تحميل الفيديو.`
          }, { quoted: msg });
        }

        await sock.sendMessage(chatId, {
          video: { url: videoPath },
          caption: `🎬 ايديت خاص بـ *إيرين ييغر* 😈🔥`
        }, { quoted: msg });

        cleanup();
      });

    } catch (err) {
      console.error("❌ خطأ في تنفيذ أمر يوميلا:", err);
      await sock.sendMessage(chatId, {
        text: "❌ حدث خطأ أثناء تنفيذ الأمر."
      }, { quoted: msg });
    }
  }
};