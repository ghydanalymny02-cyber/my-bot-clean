const axios = require('axios');
const cheerio = require('cheerio');
const qs = require('qs');

// دالة استخراج بيانات الفيديو من TikSave.io
async function fetchTikTokVideo(url) {
  const apiUrl = 'https://tiksave.io/api/ajaxSearch';
  const data = qs.stringify({ q: url, lang: 'id' });

  const headers = {
    'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
    'Accept': '*/*',
    'User-Agent': 'Mozilla/5.0',
    'Referer': 'https://tiksave.io/en',
    'X-Requested-With': 'XMLHttpRequest'
  };

  const res = await axios.post(apiUrl, data, { headers });
  const html = res.data.data;

  const $ = cheerio.load(html);
  const title = $('.tik-left h3').text().trim();
  const downloadLink = $('.dl-action a').first().attr('href');

  return {
    title,
    videoUrl: downloadLink
  };
}

module.exports = {
  command: 'تيك',
  description: 'تحميل فيديو TikTok بدون علامة مائية',
  usage: '.تيك <رابط>',
  category: 'media',

  async execute(sock, msg) {
    const chatId = msg.key.remoteJid;
    
    const text = msg.message?.conversation || 
                 msg.message?.extendedTextMessage?.text || 
                 msg.message?.imageMessage?.caption || 
                 '';

    const url = text.split(' ')[1];

    if (!url || !url.startsWith('http')) {
      return await sock.sendMessage(chatId, {
        text: '❌ أرسل رابط TikTok بعد الأمر مثل:\n\n`.تيك https://www.tiktok.com/...`',
      }, { quoted: msg });
    }

    try {
      await sock.sendMessage(chatId, { react: { text: '⏳', key: msg.key } });

      const { title, videoUrl } = await fetchTikTokVideo(url);

      if (!videoUrl) {
        return await sock.sendMessage(chatId, {
          text: '❌ لم يتم العثور على رابط تحميل الفيديو. تأكد من الرابط أو حاول لاحقًا.',
        }, { quoted: msg });
      }

      await sock.sendMessage(chatId, {
        video: { url: videoUrl },
        caption: `🎥 *${title || 'تم التحميل من TikTok'}*`,
        mimetype: 'video/mp4',
      }, { quoted: msg });

    } catch (err) {
      console.error('خطأ في تحميل فيديو تيك توك:', err.message);
      await sock.sendMessage(chatId, {
        text: '❌ حدث خطأ أثناء تحميل الفيديو. حاول لاحقًا.',
      }, { quoted: msg });
    }
  }
};