const fs = require('fs');
const path = require('path');

module.exports = {
  command: "تجربه",
  description: "اختبار إرسال صورة فقط",
  async execute(sock, msg) {
    const chatId = msg.key.remoteJid;
    const imagePath = path.join(__dirname, '../resources/escanor.jpg');

    if (!fs.existsSync(imagePath)) {
      return await sock.sendMessage(chatId, {
        text: '❌ الصورة hrp.jpeg غير موجودة في مجلد resources.'
      }, { quoted: msg });
    }

    await sock.sendMessage(chatId, {
      image: fs.readFileSync(imagePath),
      caption: " 📸 *شغال يمعلم شو لازمك أمرني*                 ♜𝒀𝑼𝑴𝑰𝑳𝑨 𝑩𝒐𝒕꧂"
    }, { quoted: msg });
  }
};