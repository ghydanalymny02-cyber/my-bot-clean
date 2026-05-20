const axios = require('axios');
const cheerio = require('cheerio');

function sanitize(str) {
  return str.replace(/[<>:"/\\|?*]+/g, '');
}

module.exports = {
  command: ['اغنيه'],
  description: '🔎 البحث وتحميل أغنية بصيغة mp3 من اليوتيوب',
  category: 'ميديا',

  async execute(sock, msg, args) {
    const text = msg.message?.conversation || msg.message?.extendedTextMessage?.text || '';
    const query = text.replace(/^[^\s]+\s*/, '');

    if (!query) {
      return sock.sendMessage(msg.key.remoteJid, {
        text: `
⊱⊹•─๋︩︪╾─•┈⧽ 🚨 ⧼┈•─╼─๋︩︪•⊹⊰  
⚠️ يَجِبُ كِتَابَةُ اِسْمِ الأُغْنِيَةِ لِمُتَابَعَةِ التَّحْمِيلِ  
⊱⊹•─๋︩︪╾─•┈⧽ 🚨 ⧼┈•─╼─๋︩︪•⊹⊰  
`}, { quoted: msg });
    }

    try {
      await sock.sendMessage(msg.key.remoteJid, { react: { text: '⏳', key: msg.key } });

      // البحث في جوجل
      const searchUrl = `https://www.google.com/search?q=site:youtube.com+${encodeURIComponent(query)}&hl=en`;
      const res = await axios.get(searchUrl, {
        headers: { 'User-Agent': 'Mozilla/5.0 (X11; Linux x86_64)' }
      });

      const $ = cheerio.load(res.data);
      const results = [];

      $('a').each((i, el) => {
        const href = $(el).attr('href');
        if (href && href.includes('youtube.com/watch')) {
          const url = href.split('&')[0].replace('/url?q=', '');
          results.push(url);
        }
      });

      if (!results.length) {
        return sock.sendMessage(msg.key.remoteJid, {
          text: `
⊱⊹•─๋︩︪╾─•┈⧽ ⚠️ ⧼┈•─╼─๋︩︪•⊹⊰  
❌ لَمْ يَتِمُّ الْعُثُورُ عَلَى نَتَائِج، جَرِّبْ اِسْمًا آخَرَ  
⊱⊹•─๋︩︪╾─•┈⧽ ⚠️ ⧼┈•─╼─๋︩︪•⊹⊰  
` }, { quoted: msg });
      }

      const videoUrl = results[0];

      // جلب معلومات التحميل من bk9
      const apiUrl = `https://bk9.fun/download/ytmp3?url=${encodeURIComponent(videoUrl)}&type=mp3`;
      const resApi = await axios.get(apiUrl);
      const result = resApi.data;

      if (!result?.status || !result?.BK9?.downloadUrl) {
        throw new Error(`❌ لَمْ يُوفِّرِ API رَابِطَ تَحْمِيلٍ صَالِحٍ.`);
      }

      const audioUrl = result.BK9.downloadUrl;
      const title = result.BK9.title || 'audio';
      const cleanTitle = sanitize(title);
      const thumbnail = result.BK9.thumbnail || 'https://i.imgur.com/ywNn7RY.jpeg';
      const duration = result.BK9.duration || 'غير معروف';
      const views = result.BK9.views || 'غير متوفرة';

      const caption = `
⊱⊹•─๋︩︪╾─•┈⧽ 🎵 ⧼┈•─╼─๋︩︪•⊹⊰  
📌 العنوان: ${title}  
⏳ المدة: ${duration}  
👁 المشاهدات: ${views}  
🔗 الرابط: ${videoUrl}  
⊱⊹•─๋︩︪╾─•┈⧽ 🎵 ⧼┈•─╼─๋︩︪•⊹⊰  
`;

      await sock.sendMessage(msg.key.remoteJid, {
        image: { url: thumbnail },
        caption
      }, { quoted: msg });

      await sock.sendMessage(msg.key.remoteJid, { react: { text: '🎵', key: msg.key } });

      await sock.sendMessage(msg.key.remoteJid, {
        audio: { url: audioUrl },
        mimetype: 'audio/mpeg',
        fileName: `${cleanTitle}.mp3`,
        ptt: false,
        contextInfo: {
          mentionedJid: [msg.key.participant || msg.key.remoteJid],
          externalAdReply: {
            title: "✔ تَمَّ التَّحْمِيلُ بِنَجَاحٍ",
            body: "ᥫ ܀𝙼𝙴𝙻𝙾 𝙱𝙾𝚃 𝙱𝚈 𝙽𝙰𝙶𝚄𝙼𝙾🍂܀᭡",
            thumbnail: await sock.profilePictureUrl(sock.user.id, 'image').catch(() => null),
            showAdAttribution: true,
            previewType: "PHOTO",
            sourceUrl: videoUrl
          }
        }
      }, { quoted: msg });

      await sock.sendMessage(msg.key.remoteJid, { react: { text: '✅', key: msg.key } });

    } catch (err) {
      console.error('خطأ:', err);
      await sock.sendMessage(msg.key.remoteJid, { react: { text: '❌', key: msg.key } });

      return sock.sendMessage(msg.key.remoteJid, {
        text: `
⊱⊹•─๋︩︪╾─•┈⧽ ❌ ⧼┈•─╼─๋︩︪•⊹⊰  
⚠️ حَدَثَ خَطَأ، حَاوِلْ مَرَّةً أُخْرَى  
📛 التفاصيل: ${err.message}
⊱⊹•─๋︩︪╾─•┈⧽ ❌ ⧼┈•─╼─๋︩︪•⊹⊰  
` }, { quoted: msg });
    }
  }
};