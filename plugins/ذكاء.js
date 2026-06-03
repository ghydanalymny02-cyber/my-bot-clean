const fetch = require('node-fetch');
const fs = require('fs');
const path = require('path');

module.exports = {
  command: ['كرول'],
  description: '🩸 تحدث مع هانزو، القاتل من الظلال.',
  category: 'ai',

  async execute(sock, msg, args) {
    const text = msg.message?.conversation || msg.message?.extendedTextMessage?.text || '';
    const body = text.trim().split(/ +/).slice(1).join(' ');

    if (!body) {
      return sock.sendMessage(msg.key.remoteJid, {
        text: `💬 *قل شيئًا لهانزو، مثل:*\n.كرول ما رأيك بالخيانة؟`,
      }, { quoted: msg });
    }

    // تفاعل البوت مع الأمر
    await sock.sendMessage(msg.key.remoteJid, {
      react: {
        text: '👺',
        key: msg.key,
      }
    });

    try {
      // تعزيز شخصية هانزو في الرد
      const hanzoPrompt = `
جاوب على السؤال ده باللهجه المصريه و تقمص شخصيه هانزو من موبايل ليجند :\n"${body}"
`;

      const apiRes = await fetch(`https://api.siputzx.my.id/api/ai/meta-llama-33-70B-instruct-turbo?content=${encodeURIComponent(hanzoPrompt)}`);
      const apiData = await apiRes.json();

      if (!apiData.status || !apiData.data) {
        throw new Error('لم أتمكن من استدعاء الظلال للرد.');
      }

      const response = apiData.data;

      await sock.sendMessage(msg.key.remoteJid, {
        text: `👺 *كرول يقول:*\n\n${response}`,
        contextInfo: {
          externalAdReply: {
            title: "كرول • قاتل الظلال",
            body: "لا تتحدث معي كثيرًا... الظل لا يهمه الضوء.",
            thumbnail: fs.readFileSync(path.join(__dirname, '../image.jpg')),
            mediaType: 1,
            renderLargerThumbnail: true,
            showAdAttribution: false,
            sourceUrl: 'https://Chrollo.shadow',
          }
        }
      }, { quoted: msg });
    } catch (err) {
      console.error('❌ خطأ في تنفيذ أمر هانزو:', err);
      await sock.sendMessage(msg.key.remoteJid, {
        text: `❌ الظلال رفضت الرد: ${err.message || err}`,
      }, { quoted: msg });
    }
  }
};