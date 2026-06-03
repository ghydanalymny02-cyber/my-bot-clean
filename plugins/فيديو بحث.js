const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');

const tempDir = '/storage/emulated/0/.bot3/tmp';
if (!fs.existsSync(tempDir)) fs.mkdirSync(tempDir, { recursive: true });

module.exports = {
  command: ['فيديو'],
  category: 'tools',
  description: 'تحميل فيديو من يوتيوب عبر الرابط أو البحث بالاسم',
  status: 'on',
  hidden: false,
  version: '1.2',

  async execute(sock, msg) {
    try {
      const messageText = (msg.message?.conversation ||
        msg.message?.extendedTextMessage?.text ||
        msg.message?.imageMessage?.caption ||
        msg.message?.videoMessage?.caption ||
        '').trim();

      // استخراج الاستعلام بعد كلمة "فيديو"
      let query = messageText.replace(/^[.,،]?(فيديو)\s*/i, '').trim();

      if (!query) {
        return await sock.sendMessage(msg.key.remoteJid, {
          text: "❌ من فضلك أرسل رابط يوتيوب أو اسم الفيديو بعد الأمر.\nمثال:\n.فيديو https://youtube.com/...\nأو\n.فيديو Messi skills"
        }, { quoted: msg });
      }

      await sock.sendMessage(msg.key.remoteJid, {
        text: '⏳ جاري التحميل، انتظر قليلًا...'
      }, { quoted: msg });

      const outputTemplate = path.join(tempDir, 'video_%(title)s.%(ext)s');
      const target = query.startsWith('http') ? query : `ytsearch1:${query}`;
      const ytCommand = `yt-dlp -f mp4 -o "${outputTemplate}" "${target}"`;

      exec(ytCommand, async (error, stdout, stderr) => {
        if (error) {
          console.error('yt-dlp error:', stderr);
          return await sock.sendMessage(msg.key.remoteJid, {
            text: '❌ حدث خطأ أثناء تحميل الفيديو.'
          }, { quoted: msg });
        }

        const files = fs.readdirSync(tempDir);
        const videoFile = files.find(f => f.endsWith('.mp4'));

        if (!videoFile) {
          return await sock.sendMessage(msg.key.remoteJid, {
            text: `❌ لم يتم العثور على نتيجة لكلمة: *${query}*`
          }, { quoted: msg });
        }

        const filePath = path.join(tempDir, videoFile);
        const videoBuffer = fs.readFileSync(filePath);

        await sock.sendMessage(msg.key.remoteJid, {
          video: videoBuffer,
          mimetype: 'video/mp4',
          caption: `🎬 تم تحميل الفيديو: ${query}`
        }, { quoted: msg });

        fs.unlinkSync(filePath);
      });

    } catch (err) {
      console.error('Video download error:', err);
      await sock.sendMessage(msg.key.remoteJid, {
        text: '❌ حدث خطأ أثناء معالجة الأمر.'
      }, { quoted: msg });
    }
  }
};