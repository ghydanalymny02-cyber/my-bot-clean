const fs = require('fs');
const path = require('path');
const { proto } = require('@whiskeysockets/baileys');

module.exports = {
  command: ['تطبيق'],
  description: 'يجلب رابط البحث عن أي تطبيق في Google Play.',
  category: 'أدوات',

  async execute(sock, msg, args = []) {
    const fullText =
      msg.message?.conversation ||
      msg.message?.extendedTextMessage?.text ||
      '';

    const query = fullText.replace(/^\.?تطبيق\s*/i, "").trim();
    if (!query) {
      await sock.sendMessage(msg.key.remoteJid, {
        text: "🔍 *رجاءً أرسل اسم التطبيق الذي تريد البحث عنه!*\n\nمثال: `.تطبيق واتساب`",
        mentions: [msg.key.participant || msg.participant || msg.key.remoteJid],
      });
      return;
    }

    try {
      const searchUrl = `https://play.google.com/store/search?q=${encodeURIComponent(query)}&c=apps`;

      // تحميل الصورة المصغرة من ملف "1.png" في نفس مجلد المشروع (تأكد أنه موجود)
      const thumbPath = path.join(process.cwd(), '1.png');
      let thumbnail = null;
      if (fs.existsSync(thumbPath)) {
        thumbnail = fs.readFileSync(thumbPath);
      }

      await sock.sendMessage(msg.key.remoteJid, {
        text: `🔍 *إليك نتائج البحث عن* "${query}":\n\n🔗 ${searchUrl}`,
        contextInfo: {
          externalAdReply: {
            title: `بحث تطبيق: ${query}`,
            body: 'Google Play Store',
            mediaType: 1,
            renderLargerThumbnail: true,
            sourceUrl: searchUrl,
            thumbnail: thumbnail,
          },
        },
      }, { quoted: msg });

    } catch (error) {
      console.error("❌ خطأ أثناء البحث عن التطبيق:", error.message);
      await sock.sendMessage(msg.key.remoteJid, {
        text: "⚠️ حدث خطأ أثناء البحث عن التطبيق، حاول لاحقًا.",
        mentions: [msg.key.participant || msg.participant || msg.key.remoteJid],
      });
    }
  }
};