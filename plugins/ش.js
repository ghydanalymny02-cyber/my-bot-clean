const fs = require('fs');
const path = require('path');

module.exports = {
  command: 'ش',
  description: '⚙️ اختبار أداء البوت',
  usage: '.ياعبد',
  category: 'tools',

  async execute(sock, msg) {
    try {
      const chatId = msg.key.remoteJid;
      const sender = msg.sender || msg.key.participant || msg.key.remoteJid;

      // 📁 تحديد مسار الصورة من مجلد resources
      const imagePath = path.join(__dirname, '../resources/escanor5.jpg');

      // ✅ تحقق أن الصورة موجودة
      if (!fs.existsSync(imagePath)) {
        throw new Error('⚠️ الصورة غير موجودة في مجلد resources!');
      }

      // 🖼️ قراءة الصورة كـ Buffer
      const imageBuffer = fs.readFileSync(imagePath);

      const messageText = `
الـعـم اســكــانــور يـعـمـل و شـقـيـان 
*- 𝒀𝑼𝑴𝑰𝑳𝑨 𝑩𝑶𝑻 ❄*`.trim();

      // 📤 إرسال الصورة مع النص فقط (بدون صورة معاينة)
      await sock.sendMessage(chatId, {
        image: imageBuffer,
        caption: messageText,
        contextInfo: {
          mentionedJid: [sender],
          externalAdReply: {
            title: "𝑬𝑺𝑪𝑨𝑵𝑶𝑹 يتحدث 🫦",
            body: "𝑹𝒆𝒂𝒅𝒚 𝑭𝒐𝒓 𝑨𝒄𝒕𝒊𝒐𝒏 🔥",
            mediaType: 1,
            sourceUrl: "https://wa.me/963996097873",
            renderLargerThumbnail: false,
            showAdAttribution: false
          }
        }
      }, { quoted: msg });

    } catch (error) {
      console.error('❌ Test Command Error:', error);
      await sock.sendMessage(msg.key.remoteJid, {
        text: '⚠️ حدث خطأ أثناء تنفيذ الأمر.',
      }, { quoted: msg });
    }
  }
};