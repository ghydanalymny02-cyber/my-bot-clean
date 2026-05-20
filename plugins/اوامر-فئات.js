const { getPlugins } = require('../handlers/plugins.js');
const fs = require('fs');
const path = require('path');

module.exports = {
  status: "on",
  name: 'قائمة الأوامر',
  command: ['فئات'],
  category: 'tools',
  description: '📜 قائمة الأوامر حسب الفئة',
  hidden: false,
  version: '5.1',

  async execute(sock, msg) {
    try {
      const body = msg.message?.extendedTextMessage?.text || msg.message?.conversation || '';
      const args = body.trim().split(' ').slice(1);
      const plugins = getPlugins();
      const categories = {};

      Object.values(plugins).forEach((plugin) => {
        if (plugin.hidden) return;
        const category = plugin.category?.toLowerCase() || 'متنوع';
        if (!categories[category]) categories[category] = [];

        let commandDisplay = '';
        if (Array.isArray(plugin.command) && plugin.command.length > 1) {
          commandDisplay = `⭑ 🧩 ${plugin.command.map(cmd => `*${cmd}*`).join(' | ')}`;
        } else {
          const cmd = Array.isArray(plugin.command) ? plugin.command[0] : plugin.command;
          commandDisplay = `⭑ 🧩 *${cmd}*`;
        }

        if (plugin.description) {
          commandDisplay += `\n⭑ 📝 الوصف: _${plugin.description}_`;
        }

        categories[category].push(commandDisplay + '\n');
      });

      let menu = '————————\n';
      menu += ' ⎯⎯⎯ 『 𓆩  𝒀𝑼𝑴𝑰𝑳𝑨  𝑩𝒐𝒕 👑 𓆪 』 ⎯⎯⎯\n';
      menu += '————————\n\n';

      if (args.length === 0) {
        // عرض الفئات فقط
        menu += '⌯ ✦ *الفئات المتوفّرة:* ✦\n\n';
        for (const cat of Object.keys(categories)) {
          menu += `⧉ ✧ \`${cat}\`\n`;
        }
        menu += `\n⌬ اكتب \`.اوامر (اسم الفئة)\` لعرض أوامرها بالتفصيل.\n`;
      } else {
        // عرض أوامر فئة معينة
        const requestedCategory = args.join(' ').toLowerCase();
        if (!categories[requestedCategory]) {
          return await sock.sendMessage(msg.key.remoteJid, {
            text: `❌ الفئة *${requestedCategory}* غير موجودة.\n⌯ اكتب \`.اوامر\` لعرض جميع الفئات المتاحة.`
          }, { quoted: msg });
        }

        menu += `⌯ ✦ *أوامر فئة: ${requestedCategory.toUpperCase()}* ✦ ⌯\n\n`;
        menu += categories[requestedCategory].join('\n');
      }

      menu += '\n————————\n';
      menu += '⚙️ ⌯ تم إعداد القائمة بواسطة: 𓆩 *❄ 𝒀𝑼𝑴𝑰𝑳𝑨  𝑩𝒐𝒕⚚* 👑 𓆪 ⌯ ⚙️\n';
      menu += '\n';

      // إرسال صورة من مجلد resources بدلاً من بروفايل البوت
      const imagePath = path.join(process.cwd(), 'resources', 'ayaner.jpg');

      if (fs.existsSync(imagePath)) {
        await sock.sendMessage(msg.key.remoteJid, {
          image: fs.readFileSync(imagePath),
          caption: menu
        }, { quoted: msg });
      } else {
        await sock.sendMessage(msg.key.remoteJid, {
          text: menu
        }, { quoted: msg });
      }

    } catch (error) {
      console.error('❌ خطأ في إنشاء القائمة:', error);
      await sock.sendMessage(msg.key.remoteJid, {
        text: '❌ حدث خطأ أثناء عرض قائمة الأوامر.'
      }, { quoted: msg });
    }
  }
};