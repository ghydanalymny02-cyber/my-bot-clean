const fs = require('fs');
const path = require('path');

module.exports = {
  command: 'شرح2',
  description: 'يرسل كل الأوامر في رسالة واحدة',
  usage: '.شرح2',
  category: 'أوامر',
  async execute(sock, msg) {
    try {
      const commands = [];

      const categories = {};

      const files = await fs.readdirSync('./plugins');
      files.forEach((file) => {
        const command = require(`./plugins/${file}`);
        commands.push(command);
        if (categories[command.category]) {
          categories[command.category].push(command);
        } else {
          categories[command.category] = [command];
        }
      });

      let message = `*╗══════━━🜲━━══════╔*\n`;
      message += `*║ 𝑭 𝑶 𝑿 ⟦⛓️⟧ 𝐍 𝐈 𝐓 𝐑 𝐎ﮩ║*\n`;
      message += `*╝══════━━🜲━━══════╚*\n`;
      message += `*⌬═───💎 الأوامر 💎───═⌬*\n`;
      message += `*┓──────━━⌯□⌯━━──────*\n`;

      Object.keys(categories).forEach((category) => {
        message += `*┃ﮩ${category}*\n`;
        categories[category].forEach((command) => {
          message += `*┃ﮩ${command.command}: ${command.description}*\n`;
        });
        message += `*┓──────━━⌯□⌯━━──────*\n`;
      });

      message += `*────────━━━━───────*\n`;

      await sock.sendMessage(msg.key.remoteJid, { text: message }, { quoted: msg });
    } catch (error) {
      console.error('خطأ في أمر شرح:', error);
    }
  },
};