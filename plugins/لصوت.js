const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');
const { downloadContentFromMessage } = require('@whiskeysockets/baileys');

module.exports = {
  command: 'لصوت',
  category: 'tools',
  description: '🎧 تحويل فيديو إلى تسجيل صوتي (Voice Note)',

  async execute(sock, msg) {
    const chatId = msg.key.remoteJid;
    const quoted = msg.message?.extendedTextMessage?.contextInfo?.quotedMessage;

    if (!quoted || !quoted.videoMessage) {
      return await sock.sendMessage(chatId, {
        text: '❌ لازم ترد على فيديو علشان أحوله لتسجيل صوتي 🎤'
      }, { quoted: msg });
    }

    try {
      const tempDir = './temp';
      if (!fs.existsSync(tempDir)) fs.mkdirSync(tempDir, { recursive: true });

      const timestamp = Date.now();
      const videoPath = path.join(tempDir, `${timestamp}.mp4`);
      const audioPath = path.join(tempDir, `${timestamp}.opus`);

      // 🔽 تحميل الفيديو
      const stream = await downloadContentFromMessage(quoted.videoMessage, 'video');
      const chunks = [];
      for await (const chunk of stream) chunks.push(chunk);
      fs.writeFileSync(videoPath, Buffer.concat(chunks));

      await sock.sendMessage(chatId, { text: '🎧 جاري استخراج الصوت يا نجم...' }, { quoted: msg });

      // 🔄 تحويل الفيديو لصوت
      exec(`ffmpeg -i "${videoPath}" -vn -c:a libopus -b:a 128k "${audioPath}"`, async (err) => {
        if (err || !fs.existsSync(audioPath)) {
          console.error('❌ فشل التحويل:', err?.message);
          fs.existsSync(videoPath) && fs.unlinkSync(videoPath);
          return await sock.sendMessage(chatId, {
            text: '❌ معرفتش أحول الفيديو لتسجيل صوتي 😞'
          }, { quoted: msg });
        }

        try {
          // 🎙️ إرسال الصوت كفويس نوت + بنفس ستايل العبد
          await sock.sendMessage(
            chatId,
            {
              audio: { url: audioPath },
              mimetype: 'audio/ogg; codecs=opus',
              ptt: true,
              contextInfo: {
                isForwarded: true,
                forwardingScore: 50,
                forwardedNewsletterMessageInfo: {
                  newsletterJid: "120363400192045844@newsletter",
                  newsletterName: "❅𝑂⃝🍷 𝟕𝐀𝐑𝐁ｼ",
                  serverMessageId: 999
                }
              }
            },
            { quoted: msg }
          );

          // 💫 يعمل رياكشن على رسالة الأمر نفسها 🎧
          await sock.sendMessage(chatId, {
            react: { text: '🎧', key: msg.key }
          });

        } catch (sendErr) {
          console.error('❌ خطأ أثناء الإرسال:', sendErr.message);
        } finally {
          fs.unlinkSync(videoPath);
          fs.unlinkSync(audioPath);
        }
      });

    } catch (err) {
      console.error('✗✗ خطأ عام في أمر لصوت:', err);
      await sock.sendMessage(chatId, {
        text: `❌ حصل خطأ:\n${err.message}`
      }, { quoted: msg });
    }
  }
};