const axios = require('axios');
const cheerio = require('cheerio');

function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

module.exports = {
  command: 'شخصيه',
  description: '🔍 يبحث عن صور بجودة عالية لأي شخصية أنمي أو حقيقية.',
  usage: 'شخصيه [الاسم] [عدد الصور]',
  category: 'fun',

  async execute(sock, msg) {
    try {
      const body = msg.message?.conversation || msg.message?.extendedTextMessage?.text || '';
      const text = body.trim().split(' ').slice(1).join(' ');

      if (!text) {
        return await sock.sendMessage(msg.key.remoteJid, {
          text: '❗ اكتب اسم بعد الأمر مثل: شخصيه ناروتو 3'
        }, { quoted: msg });
      }

      const split = text.split(' ');
      let limit = parseInt(split[split.length - 1]);
      if (isNaN(limit)) limit = 3;
      if (limit > 10) limit = 10;

      const query = split.slice(0, -1).join(' ') || text;

      const searchUrl = `https://www.bing.com/images/search?q=${encodeURIComponent(query)}&qft=+filterui:imagesize-large&form=IRFLTR`;

      const { data } = await axios.get(searchUrl, {
        headers: { 'User-Agent': 'Mozilla/5.0' }
      });

      const $ = cheerio.load(data);
      let images = [];

      $('a.iusc').each((i, el) => {
        try {
          const meta = JSON.parse($(el).attr('m'));
          if (meta && meta.murl && meta.murl.startsWith('http')) {
            images.push(meta.murl);
          }
        } catch (_) {}
      });

      if (!images.length) {
        return await sock.sendMessage(msg.key.remoteJid, {
          text: '❌ لم يتم العثور على صور عالية الجودة.'
        }, { quoted: msg });
      }

      // 🔀 خلط الصور عشوائيًا
      images = shuffle(images);

      const selected = images.slice(0, limit);

      for (const img of selected) {
        await sock.sendMessage(msg.key.remoteJid, {
          image: { url: img },
          caption: `📸 *شخصية:* ${query}`
        }, { quoted: msg });
      }

    } catch (err) {
      console.error('❌ خطأ في أمر شخصيه:', err);
      await sock.sendMessage(msg.key.remoteJid, {
        text: `❌ حصل خطأ:\n${err.message || err.toString()}`
      }, { quoted: msg });
    }
  }
};