const axios = require('axios');
const cheerio = require('cheerio');

module.exports = {
  command: 'زخرفه',
  description: 'زخرفة الاسم بأشكال متنوعة (إنجليزي فقط)',
  category: 'fun',
  usage: 'زخرفه Chrollo',

  async execute(sock, msg) {
    const body = msg.message?.conversation || msg.message?.extendedTextMessage?.text || '';
    const name = body.split(' ').slice(1).join(' ').trim();

    if (!name) {
      return await sock.sendMessage(msg.key.remoteJid, {
        text: '❗ اكتب الاسم بعد الأمر مثل:\n.زخرفه Chrollo'
      }, { quoted: msg });
    }

    try {
      const res = await axios.get(`https://qaz.wtf/u/convert.cgi?text=${encodeURIComponent(name)}`);
      const $ = cheerio.load(res.data);
      const results = [];

      $('table > tbody > tr').each((i, el) => {
        const font = $(el).find('td').eq(1).text().trim();
        if (font) results.push(font);
      });

      if (results.length === 0) {
        return await sock.sendMessage(msg.key.remoteJid, {
          text: '❌ لم يتم العثور على زخارف.'
        }, { quoted: msg });
      }

      const reply = results.slice(0, 15).map((z, i) => `*${i + 1}-* ${z}`).join('\n\n');

      await sock.sendMessage(msg.key.remoteJid, {
        text: `✨ *زخارف لاسم:* ${name}\n\n${reply}`
      }, { quoted: msg });

    } catch (err) {
      console.error('❌ خطأ في أمر زخرفه:', err.message);
      return await sock.sendMessage(msg.key.remoteJid, {
        text: `❌ حصل خطأ أثناء الزخرفة:\n${err.message}`
      }, { quoted: msg });
    }
  }
};