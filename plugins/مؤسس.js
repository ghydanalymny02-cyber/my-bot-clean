// *كود من عمو مــجــهــول||𝕲𝕳𝕰𝕯𝕬𝕹 المظ 🫦*
// 📄 *مؤسس.js* (جزء 1/1):

const fs = require('fs');
const { join } = require('path');

global.owner = [
  ['967700821174', 'مــجــهــول||𝕲𝕳𝕰𝕯𝕬𝕹⊰𝐁𝐎𝐓 ♔', true],
];

module.exports = {
  command: 'مؤسس',
  description: 'عرض معلومات المطور مع جهة الاتصال',
  usage: '.مطور',
  category: 'info',

  async execute(sock, msg) {
    // تعريف chatId هنا في البداية عشان الـ catch يقدر يقرأه لو حصل خطأ
    const chatId = msg.key.remoteJid;

    try {
      const [devId, devName] = global.owner[0];
      const devTitle = 'مــجــهــول||𝕲𝕳𝕰𝕯𝕬𝕹⊰𝐁𝐎𝐓 ❄';
      const devCountry = '𝓁𝒾𝒷𝓎𝒶';
      const devAge = 'قد الكوكب🥀';
      const devNumber = `+967700821174`;
      const waLink = `https://wa.me/967700821174`;

      const infoMessage = `
╗════════════════╔
║ ✨ 𝓓𝓮𝓿𝓮𝓵𝓸𝓹𝓮𝓻 𝓘𝓷𝓯𝓸 ✨   ║
╣════════════════╠
║ 🌟 𝓝𝓪𝓶𝓮: ${devName}
║ 🌍 𝓒𝓸𝓾𝓷𝓽𝓻𝔂: ${devCountry}
║ 🎂 𝓐𝓰𝓮: ${devAge}
║ 📞 𝓝𝓾𝓶𝓫𝓮𝓻: ${devNumber}
╣════════════════╠
║ 📨 𝓒𝓸𝓷𝓽𝓪𝓬𝓽 𝓶𝓮 𝓿𝓲𝓪 𝓦𝓱𝓪𝓽𝓼𝓐𝓹𝓹:
║ ${waLink}
╝════════════════╚
      `.trim();

      const buttons = [
        {
          index: 0,
          urlButton: {
            displayText: 'developed by مــجــهــول||𝕲𝕳𝕰𝕯𝕬𝕹⊰𝐁𝐎𝐓 ♔',
            url: waLink,
          },
        }
      ];

      const imagePath = join(__dirname, '../resources/escanor.jpg');
      
      if (fs.existsSync(imagePath)) {
        await sock.sendMessage(chatId, {
          image: fs.readFileSync(imagePath),
          caption: infoMessage,
          footer: devTitle,
          buttons: buttons,
          headerType: 4
        }, { quoted: msg });
      } else {
        await sock.sendMessage(chatId, {
          text: infoMessage,
          footer: devTitle,
          buttons: buttons,
        }, { quoted: msg });
      }

      const vcard = `
BEGIN:VCARD
VERSION:3.0
FN:${devTitle}
TEL;type=CELL;type=VOICE;waid=${devId}:${devNumber}
EMAIL:noy.dev@example.com
NOTE: Age ${devAge} – Country ${devCountry}
END:VCARD
      `.trim();

      await sock.sendMessage(chatId, {
        contacts: {
          displayName: devName,
          contacts: [{ vcard }]
        }
      }, { quoted: msg });

    } catch (err) {
      console.error('❌ Error in developer command:', err);
      await sock.sendMessage(chatId, {
        text: `❌ An error occurred while showing developer info:\n${err.message || err.toString()}`,
      }, { quoted: msg });
    }
  },
};
