const axios = require('axios');
const fs = require('fs');

module.exports = {
  command: ['فيد-تيك'],
  category: 'tools',
  description: 'تحميل فيديو من تيك توك عبر الاسم',
  status: 'on',
  version: '3.0',

  async execute(sock, msg) {
    const text = (
      msg.message?.conversation ||
      msg.message?.extendedTextMessage?.text ||
      msg.message?.imageMessage?.caption ||
      msg.message?.videoMessage?.caption ||
      ''
    ).trim();

    const query = text.replace(/^[.,،]?(اغنيه|تيك)\s*/i, '').trim();

    if (!query) {
      return await sock.sendMessage(msg.key.remoteJid, {
        text: `⊱⊹•─๋︩︪╾─•┈⧽ 🚨 ⧼┈•─╼─๋︩︪•⊹⊰\n⚠️ يَجِبُ كِتَابَةُ اِسْمِ الْفِيدْيُو لِمُتَابَعَةِ التَّحْمِيلِ\n⊱⊹•─๋︩︪╾─•┈⧽ 🚨 ⧼┈•─╼─๋︩︪•⊹⊰`
      }, { quoted: msg });
    }

    await sock.sendMessage(msg.key.remoteJid, {
      react: { text: "⏳", key: msg.key }
    });

    try {
      const { data } = await axios.get(`https://apis-starlights-team.koyeb.app/starlight/tiktoksearch?text=${encodeURIComponent(query + ' tiktok')}`);
      const results = data.data;

      if (!results || results.length === 0) {
        return await sock.sendMessage(msg.key.remoteJid, {
          text: `⊱⊹•─๋︩︪╾─•┈⧽ ⚠️ ⧼┈•─╼─๋︩︪•⊹⊰\n❌ لَمْ يَتِمُّ الْعُثُورُ عَلَى نَتَائِج، جَرِّبْ اِسْمًا آخَرَ\n⊱⊹•─๋︩︪╾─•┈⧽ ⚠️ ⧼┈•─╼─๋︩︪•⊹⊰`
        }, { quoted: msg });
      }

      const best = results[0];

      // إرسال صورة وشرح
      const caption = `
⊱⊹•─๋︩︪╾─•┈⧽ 🎬 ⧼┈•─╼─๋︩︪•⊹⊰
🎵 العنوان: ${best.title}
⏳ المدة: ${best.duration}
👁 المشاهدات: ${best.play}
🔗 الرابط: ${best.nowm}
⊱⊹•─๋︩︪╾─•┈⧽ 🎬 ⧼┈•─╼─๋︩︪•⊹⊰`;

      await sock.sendMessage(msg.key.remoteJid, {
        image: { url: best.cover },
        caption
      }, { quoted: msg });

      // إرسال الفيديو بدل الصوت
      await sock.sendMessage(msg.key.remoteJid, {
        video: { url: best.nowm },
        caption: `🎥 تم التحميل بنجاح!\n📌 ${best.title}`,
        mimetype: 'video/mp4'
      }, { quoted: msg });

      await sock.sendMessage(msg.key.remoteJid, {
        react: { text: "✅", key: msg.key }
      });

    } catch (err) {
      console.error('Error fetching TikTok video:', err.message);
      await sock.sendMessage(msg.key.remoteJid, {
        text: `⊱⊹•─๋︩︪╾─•┈⧽ ❌ ⧼┈•─╼─๋︩︪•⊹⊰\n⚠️ حَدَثَ خَطَأ، حَاوِلْ مَرَّةً أُخْرَى\n⊱⊹•─๋︩︪╾─•┈⧽ ❌ ⧼┈•─╼─๋︩︪•⊹⊰`
      }, { quoted: msg });
    }
  }
};