const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');

module.exports = {
  command: "بارليف",
  description: "عرض صورة وفيديو عن نصر أكتوبر واقتحام خط بارليف",
  usage: ".بارليف",
  category: "edit",

  async execute(sock, msg) {
    const chatId = msg.key.remoteJid;
    const imagePath = './resources/barlef.jpg';
    const tiktokLinks = [
      "https://vt.tiktok.com/ZSBmSkHcF/"
    ];
    const randomVideo = tiktokLinks[Math.floor(Math.random() * tiktokLinks.length)];

    const timestamp = Date.now();
    const tempDir = './temp';
    const videoPath = path.join(tempDir, `${timestamp}.mp4`);

    if (!fs.existsSync(tempDir)) fs.mkdirSync(tempDir, { recursive: true });

    const cleanup = () => {
      if (fs.existsSync(videoPath)) {
        fs.unlink(videoPath, (err) => {
          if (err) console.error("فشل حذف الفيديو:", err.message);
        });
      }
    };

    try {
      // إرسال الصورة مع الكابشن المعدل
      await sock.sendMessage(chatId, {
        image: { url: imagePath },
        caption: `🇪🇬 *ذكرى نصر أكتوبر المجيد*\n\nفي 6 أكتوبر، سطّر أبطال مصر ملحمة بطولية باقتحام خط بارليف، وحطموا بتوع البامبز على دماغهم.\n\n🔥 *تم فشخ إسرائيل شر فشخة*\n\nالمجد للشهداء ✌️ وتحيا مصر للأبد 🇪🇬`
      }, { quoted: msg });

      await sock.sendMessage(chatId, {
        text: `⏳ جاري تحميل فيديو النصر...`,
      }, { quoted: msg });

      exec(`yt-dlp -f best -o "${videoPath}" "${randomVideo}"`, async (errDownload) => {
        if (errDownload || !fs.existsSync(videoPath)) {
          console.error("فشل تحميل الفيديو:", errDownload?.message);
          cleanup();
          return await sock.sendMessage(chatId, {
            text: `❌ فشل تحميل الفيديو.`
          }, { quoted: msg });
        }

        await sock.sendMessage(chatId, {
          video: { url: videoPath },
          caption: `🎥 *مقطع خاص بملحمة أكتوبر*\n💥 *فشخنا إسرائيل ورفعنا راية النصر فوق خط بارليف*\n🇪🇬 *تحيا مصر*`
        }, { quoted: msg });

        cleanup();
      });

    } catch (err) {
      console.error("❌ خطأ أثناء تنفيذ أمر بارليف:", err);
      await sock.sendMessage(chatId, {
        text: "❌ حدث خطأ أثناء تنفيذ الأمر."
      }, { quoted: msg });
    }
  }
};