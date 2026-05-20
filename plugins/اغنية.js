const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');

const tempDir = '/storage/emulated/0/.bot3/tmp';
if (!fs.existsSync(tempDir)) fs.mkdirSync(tempDir, { recursive: true });

module.exports = {
  command: 'اغنيه',
  category: 'media',
  description: 'تحميل أغنية MP3 من يوتيوب عبر الرابط أو الاسم',
  usage: '.اغنيه [اسم الأغنية أو رابط YouTube]',

  async execute(sock, msg) {
    try {
      const chatId = msg.key.remoteJid;
      const messageText = (
        msg.message?.conversation ||
        msg.message?.extendedTextMessage?.text ||
        msg.message?.imageMessage?.caption ||
        msg.message?.videoMessage?.caption ||
        ''
      ).trim();

      // استخراج الاستعلام بعد كلمة "اغنيه"
      const query = messageText.replace(/^[.,،]?(اغنيه)\s*/i, '').trim();

      if (!query) {
        return await sock.sendMessage(chatId, {
          text: "❗ اكتب اسم الأغنية أو أرسل رابط يوتيوب مباشر.\nمثال:\n.اغنيه Despacito\nأو\n.اغنيه https://youtube.com/...",
          quoted: msg
        });
      }

      await sock.sendMessage(chatId, {
        text: `🎶 جاري التحميل: *${query}*...`,
        quoted: msg
      });

      const outputTemplate = path.join(tempDir, 'song.%(ext)s');
      const target = query.startsWith('http') ? query : `ytsearch1:${query}`;
      const ytCommand = `yt-dlp -x --audio-format mp3 -o "${outputTemplate}" "${target}"`;

      exec(ytCommand, async (error, stdout, stderr) => {
        if (error) {
          console.error('yt-dlp error:', stderr);
          return await sock.sendMessage(chatId, {
            text: '❌ حدث خطأ أثناء تحميل الأغنية.',
            quoted: msg
          });
        }

        const files = fs.readdirSync(tempDir);
        const audioFile = files.find(f => f.endsWith('.mp3'));

        if (!audioFile) {
          return await sock.sendMessage(chatId, {
            text: `❌ لم يتم العثور على نتيجة لكلمة: *${query}*`,
            quoted: msg
          });
        }

        const filePath = path.join(tempDir, audioFile);
        const audioBuffer = fs.readFileSync(filePath);

        await sock.sendMessage(chatId, {
          audio: audioBuffer,
          mimetype: 'audio/mp4',
          ptt: false,
          contextInfo: {
            externalAdReply: {
              title: `🎵 نتيجة التحميل: ${query}`,
              body: "تم التحميل بنجاح",
              thumbnail: fs.readFileSync('./image.jpeg'),
              mediaType: 2,
              mediaUrl: "https://youtube.com",
              sourceUrl: "https://youtube.com"
            }
          }
        }, { quoted: msg });

        fs.unlinkSync(filePath);
      });

    } catch (err) {
      console.error('Audio download error:', err);
      await sock.sendMessage(msg.key.remoteJid, {
        text: '❌ حدث خطأ أثناء معالجة الأمر.',
        quoted: msg
      });
    }
  }
};