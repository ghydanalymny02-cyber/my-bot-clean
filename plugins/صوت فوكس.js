const { writeFileSync, unlinkSync } = require('fs');
const { exec } = require('child_process');
const path = require('path');
const axios = require('axios');
const { getAudioUrl } = require('google-tts-api');
const { franc } = require('franc-min'); // ✅ التعديل هنا

const decorate = (text) =>
  `❴✾❵──━━━━❨⚡ 𝑭𝑶𝑿 ❩━━━━──❴✾❵\n*${text}*\n❴✾❵──━━━━❨⚡❩━━━━──❴✾❵`;

module.exports = {
  command: 'حول',
  description: '🎤 يحوّل النص اللي ترد عليه إلى صوت بأي لغة.',
  async execute(sock, msg) {
    const quoted = msg.message?.extendedTextMessage?.contextInfo?.quotedMessage;

    if (!quoted || (!quoted.conversation && !quoted.extendedTextMessage?.text)) {
      return sock.sendMessage(msg.key.remoteJid, {
        text: decorate('🗯️ لازم ترد على رسالة فيها نص علشان فوكس يحولها لصوت 🎙️'),
      }, { quoted: msg });
    }

    const text = quoted.conversation || quoted.extendedTextMessage?.text || '';

    if (text.length > 400) {
      return sock.sendMessage(msg.key.remoteJid, {
        text: decorate('📏 النص طويل جدًا! اختصره شوية 😅'),
      }, { quoted: msg });
    }

    const detectedLang = franc(text);
    const langCode = detectedLang === 'und' ? 'ar' : detectedLang;

    try {
      const url = getAudioUrl(text, {
        lang: langCode,
        slow: false,
        host: 'https://translate.google.com',
      });

      const mp3Path = path.join(__dirname, '../temp/sonic.mp3');
      const oggPath = path.join(__dirname, '../temp/sonic.ogg');

      const res = await axios.get(url, { responseType: 'arraybuffer' });
      writeFileSync(mp3Path, res.data);

      await new Promise((resolve, reject) => {
        exec(`ffmpeg -i "${mp3Path}" -ar 48000 -ac 1 -c:a libopus "${oggPath}"`, (err) => {
          if (err) reject(err);
          else resolve();
        });
      });

      await sock.sendMessage(
        msg.key.remoteJid,
        {
          audio: { url: oggPath },
          mimetype: 'audio/ogg; codecs=opus',
          ptt: true
        },
        { quoted: msg }
      );

      unlinkSync(mp3Path);
      unlinkSync(oggPath);

    } catch (err) {
      console.error('❌ Error:', err);
      return sock.sendMessage(msg.key.remoteJid, {
        text: decorate('❌ فوكس تعثر أثناء تحويل النص لصوت 🌀'),
      }, { quoted: msg });
    }
  }
};