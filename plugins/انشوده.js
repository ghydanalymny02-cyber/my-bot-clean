const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');

const nasheedList = [
  'https://vt.tiktok.com/ZSBQsMT7c/',
  'https://vt.tiktok.com/ZSBQsJ56d/',
  'https://vt.tiktok.com/ZSBQsJhnM/',
  'https://vt.tiktok.com/ZSBQs8dmD/',
  'https://vt.tiktok.com/ZSBQshwaS/',
  'https://vt.tiktok.com/ZSBQskBVN/',
  'https://vt.tiktok.com/ZSBQs2u71/',
  'https://vt.tiktok.com/ZSBQsBWQ1/',
  'https://vt.tiktok.com/ZSBQsS7fg/',
  'https://vt.tiktok.com/ZSBQse2QD/',
  'https://vt.tiktok.com/ZSBQsN2Ca/',
  'https://vt.tiktok.com/ZSBQsLQ91/',
  'https://vt.tiktok.com/ZSBQpo1aB/',
  'https://vt.tiktok.com/ZSBQsSLW3/',
  'https://vt.tiktok.com/ZSBQs6cAN/',
];

const indexFile = './temp/last_nasheed.json';

module.exports = {
  command: 'انشوده',
  description: '🎵 استمع إلى أنشودة خاشعة',
  category: 'ترفيه',
  usage: '.انشوده',

  async execute(sock, msg) {
    const from = msg.key.remoteJid;
    const imagePath = path.join(__dirname, '../resources/yahz.jpg');
    const audioTempPath = `./temp/nasheed-${Date.now()}.mp3`;

    // 🧠 قراءة آخر رقم أنشودة تم تشغيله
    let currentIndex = 0;
    if (fs.existsSync(indexFile)) {
      const fileData = fs.readFileSync(indexFile, 'utf8');
      currentIndex = JSON.parse(fileData).last || 0;
    }

    const selectedUrl = nasheedList[currentIndex];
    const nextIndex = (currentIndex + 1) % nasheedList.length;
    fs.writeFileSync(indexFile, JSON.stringify({ last: nextIndex }));

    // 🖼️ إرسال الصورة مع الرسالة الفخمة
    await sock.sendMessage(from, {
      image: fs.readFileSync(imagePath),
      caption: `*┏━━ 🎧 أنشودة خاشعة ━━┓*

✨ أغلق عينيك...
🎶 ودع الكلمات تهمس لقلبك.

*┗━━━━━━━━━━━━━━┛*`
    }, { quoted: msg });

    // ⬇️ تحميل الصوت من TikTok
    exec(`yt-dlp -x --audio-format mp3 -o "${audioTempPath}" "${selectedUrl}"`, async (err) => {
      if (err || !fs.existsSync(audioTempPath)) {
        return sock.sendMessage(from, { text: '❌ لم نتمكن من تحميل الأنشودة.' }, { quoted: msg });
      }

      // 🎵 إرسال الصوت مباشرة بدون رسائل إضافية
      await sock.sendMessage(from, {
        audio: { url: audioTempPath },
        mimetype: 'audio/mpeg',
        ptt: false
      }, { quoted: msg });

      fs.unlinkSync(audioTempPath); // 🧹 حذف الملف المؤقت
    });
  }
};