const fs = require('fs');
const path = require('path');

module.exports = {
  command: 'تستي',
  description: 'اختبار البوت',
  usage: '.تست',
  category: 'tools',

  async execute(sock, msg) {
    try {
      const fancyText = `
╭─❖ 『مـــجـــهـــول 𝑩𝑶𝑻 ❄』 ❖─╮
│
│ *»D𝐎𝐍'𝐓 𝐏𝑳𝐀𝐘 𝐖𝐈𝐓𝐇 𝑮𝑶𝑱𝑶ｼ»*
│ *_𝑾𝑬𝑳𝑪𝑶𝑴𝑬 𝑻𝑶 𝑯𝑬𝑳𝑳_*
│
╰────────────╯`;

      const imagePath = path.join(__dirname, '../resources/escanor5.jpg');
      const hasImage = fs.existsSync(imagePath);
      const imageBuffer = hasImage ? fs.readFileSync(imagePath) : null;

      await sock.sendMessage(
        msg.key.remoteJid,
        {
          text: fancyText,
          contextInfo: {
            externalAdReply: {
              title: "❄ مـــجـــهـــول❄",
              body: "جرب اللعب؟ جهّز نفسك للجحيم 🔥",
              thumbnail: imageBuffer,
              mediaType: 1,
              sourceUrl: "wa.me/963996097873?text=هلا+يا+حب+♥️",
              renderLargerThumbnail: false,
              showAdAttribution: true
            }
          }
        },
        { quoted: msg }
      );

    } catch (err) {
      await sock.sendMessage(msg.key.remoteJid, {
        text: `⚠️ حدث خطأ: ${err.message || err.toString()}`
      }, { quoted: msg });
    }
  }
};