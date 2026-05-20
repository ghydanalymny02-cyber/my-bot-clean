const axios = require('axios');
const cheerio = require('cheerio');

// helper لتحميل رابط وإرجاع buffer
async function fetchBuffer(url, headers = {}) {
  const res = await axios.get(url, { responseType: 'arraybuffer', headers });
  return Buffer.from(res.data);
}

module.exports = {
  command: ['بنترست'],
  description: 'تحميل صورة أو فيديو من رابط بنترست',
  usage: '.بنترست <رابط بنترست>',
  async execute(sock, msg, args) {
    try {
      const quoted = msg.message?.extendedTextMessage?.text || '';
      const input = args.join(' ') || quoted;
      if (!input) {
        return await sock.sendMessage(msg.key.remoteJid, { text: 'أرسل رابط بنترست بعد الأمر: .بنترست <الرابط>' }, { quoted: msg });
      }

      const url = input.trim();

      // جلب صفحة بنترست
      const pageRes = await axios.get(url, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
          'Accept-Language': 'en-US,en;q=0.9'
        },
        maxRedirects: 5,
        timeout: 15000
      });
      const html = pageRes.data;
      const $ = cheerio.load(html);

      // 1) محاولة استخراج meta og:video / og:image
      let mediaUrl = null;
      const ogVideo = $('meta[property="og:video"], meta[name="og:video"]').attr('content') 
                    || $('meta[property="og:video:secure_url"]').attr('content');
      const ogImage = $('meta[property="og:image"], meta[name="og:image"]').attr('content');

      if (ogVideo) mediaUrl = ogVideo;
      else if (ogImage) mediaUrl = ogImage;

      // 2) محاولة استخراج من JSON-LD (script[type="application/ld+json"])
      if (!mediaUrl) {
        $('script[type="application/ld+json"]').each((i, el) => {
          try {
            const txt = $(el).html();
            const jd = JSON.parse(txt);
            // تبحث عن contentUrl أو thumbnailUrl أو url داخل الكائن
            if (!mediaUrl) {
              if (jd.contentUrl) mediaUrl = jd.contentUrl;
              else if (jd.thumbnailUrl) mediaUrl = jd.thumbnailUrl;
              else if (jd.url) mediaUrl = jd.url;
            }
          } catch (e) { /* تجاهل JSON غير صالح */ }
        });
      }

      // 3) بعض صفحات بنترست تحفظ معلومات في window.__INITIAL_STATE__ أو في <script> كـ "images"
      if (!mediaUrl) {
        const scriptText = $('script').map((i,el)=>$(el).html()).get().join('\n');
        const re = /"contentUrl"\s*:\s*"([^"]+)"/i;
        const m = scriptText.match(re);
        if (m && m[1]) mediaUrl = m[1].replace(/\\u0026/g, '&').replace(/\\\//g, '/');
      }

      if (!mediaUrl) {
        return await sock.sendMessage(msg.key.remoteJid, { text: 'لم أستطع استخراج رابط الميديا من هذا الرابط. حاول رابط بنترست آخر أو أرسِل الرابط الكامل.' }, { quoted: msg });
      }

      // بعض الروابط قد تكون نسبية أو تحتوي على escape sequences -> تنظيف
      mediaUrl = mediaUrl.replace(/\\u0026/g, '&').replace(/\\\//g, '/');

      // تحقق من نوع الميديا
      const lower = mediaUrl.split('?')[0].toLowerCase();
      const isVideo = lower.endsWith('.mp4') || /video/i.test(mediaUrl);

      // جلب البايناري
      const buffer = await fetchBuffer(mediaUrl, {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
        Referer: url
      });

      if (isVideo) {
        // إرسال كفيديو
        await sock.sendMessage(msg.key.remoteJid, {
          video: buffer,
          mimetype: 'video/mp4',
          caption: '🎬 فيديو من Pinterest'
        }, { quoted: msg });
      } else {
        // إرسال كصورة (image/jpeg/png)
        await sock.sendMessage(msg.key.remoteJid, {
          image: buffer,
          caption: '🖼️ صورة من Pinterest'
        }, { quoted: msg });
      }

    } catch (err) {
      console.error('Pinterest command error:', err);
      const errMsg = err.response?.status ? `حدث خطأ (${err.response.status}) أثناء جلب الرابط.` : 'حصل خطأ أثناء المعالجة. تأكد من أن الرابط صالح وأن الموقع متاح.';
      await sock.sendMessage(msg.key.remoteJid, { text: `❌ فشل التحميل: ${errMsg}` }, { quoted: msg });
    }
  }
};