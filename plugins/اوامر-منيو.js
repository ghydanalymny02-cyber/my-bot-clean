const fs = require('fs');
const { getPlugins } = require('../handlers/plugins');

module.exports = {
  name: 'menu',
  command: ['منيو'],
  category: 'tools',
  description: '📂 عرض أقسام الأوامر مع صورة',

  async execute(sock, msg) {
    const plugins = getPlugins();
    const categories = new Set();

    for (const plugin of Object.values(plugins)) {
      if (plugin.hidden) continue;
      categories.add(plugin.category || 'misc');
    }

    const categoryList = Array.from(categories)
      .map(cat => `📁 *${cat.toUpperCase()}*`)
      .join('\n');

    const message = `╭═──『 👑 قائمة الأقسام 』──═╮

${categoryList}

💡 اكتب: *.اوامر* لعرض كل الأوامر

╰────『❄ مــجــهــول||𝕲𝕳𝕰𝕯𝕬𝕹  𝑩𝒐𝒕꧂
』────╯`;

    const imagePath = './image.jpeg'; // ضع صورة باسم image.jpg في مجلد البوت

    if (fs.existsSync(imagePath)) {
      await sock.sendMessage(msg.key.remoteJid, {
        image: fs.readFileSync(imagePath),
        caption: message
      }, { quoted: msg });
    } else {
      await sock.sendMessage(msg.key.remoteJid, { text: message }, { quoted: msg });
    }
  }
};