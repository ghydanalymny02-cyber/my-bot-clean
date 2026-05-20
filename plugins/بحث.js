// *حقوق مطور مــجــهــول||𝕲𝕳𝕰𝕯𝕬𝕹 🛡*
// 📄 بحث.js

const { searchImages } = require('@whiskeysockets/baileys'); // مكتبة البحث عن الصور

module.exports = {
  command: ['بحث'],
  description: 'البحث عن صورة من الإنترنت',
  category: 'أدوات',

  async execute(sock, msg, args = []) {
    const jid = msg.key.remoteJid;

    // 📝 النص الكامل بعد كلمة "بحث"
    const query = args.length > 0 ? args.join(" ") : null;
    if (!query) {
      return await sock.sendMessage(jid, {
        text: "⚠️ اكتب ما تريد البحث عنه بعد الأمر.\nمثال: .بحث يوميلا"
      }, { quoted: msg });
    }

    try {
      // 🔎 البحث عن الصور
      const results = await searchImages(query);

      if (!results || results.length === 0) {
        return await sock.sendMessage(jid, {
          text: `❌ لم أجد صور عن: ${query}`
        }, { quoted: msg });
      }

      // 🖼️ إرسال أول صورة مع الكابشن
      await sock.sendMessage(jid, {
        image: { url: results[0].url },
        caption: `🔎 نتيجة البحث عن: ${query}`
      }, { quoted: msg });

    } catch (error) {
      console.error('💥 خطأ في بحث.js:', error);
      await sock.sendMessage(jid, {
        text: `❌ حدث خطأ أثناء البحث:\n${error.message}`
      }, { quoted: msg });
    }
  }
};