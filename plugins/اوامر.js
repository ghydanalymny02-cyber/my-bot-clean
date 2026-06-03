const { getPlugins } = require('../handlers/plugins.js');
const fs = require('fs');
const { join } = require('path');

module.exports = {
  status: "on",
  name: 'Bot Commands',
  command: ['اوامر'],
  category: 'tools',
  description: '📜 قائمة بجميع أوامر البوت التابعة لـ ᵐᵉᵉᵉᵉ.',
  hidden: false,
  version: '4.0',

  async execute(sock, msg) {
    try {
      // 📜 الريأكشن
      const zarfData = JSON.parse(fs.readFileSync(join(process.cwd(), 'zarf.json')));
      if (zarfData.reaction_status === "on" && zarfData.reaction) {
        await sock.sendMessage(msg.key.remoteJid, {
          react: { text: zarfData.reaction, key: msg.key }
        }).catch(() => {});
      }

      // 🧩 جلب الأوامر
      const plugins = getPlugins();
      const categorized = {};

      // 🧠 إيموجي مخصص لكل أمر (تقدر تزود عليه زي ما تحب)
      const commandEmojis = {
        'طرد': '🚫',
        'استعد': '♻️',
        'بان': '🔒',
        'الغاء': '🔓',
        'اوامر': '📜',
        'فنش': '💣',
        'مغادره': '👋',
        'ترحيب': '🎉',
        'جروب': '👥',
        'xo': '❌⭕',
        'كتابة': '✍️'
        // زود هنا أوامر تانية حسب ما تحب
      };

      for (const plugin of Object.values(plugins)) {
        if (plugin.hidden) continue;
        const cat = plugin.category || 'misc';
        if (!categorized[cat]) categorized[cat] = [];

        const cmds = Array.isArray(plugin.command) ? plugin.command : [plugin.command];
        const formatted = cmds.map(cmd => {
          const emoji = commandEmojis[cmd.toLowerCase()] || '•';
          return `⎯ ❖ ${emoji} *${cmd}*`;
        }).join('\n');

        categorized[cat].push(formatted);
      }

      // 🎭 رموز للفئات
      const icons = {
        admin: '🛡️',
        tools: '🛠️',
        games: '🎮',
        fun: '🎭',
        media: '🖼️',
        group: '👥',
        DEVELOPER: '🪐',
        developer: '🪐',
        INFO: '✨',
        info: '✨',
        ترفيه: '🎮',
        ديني: '📿',
        معلومات: '🧠',
        edit: '🍷',
     EDIT: '🍷',
        AI: '🐊',
        ai: '🐊',
        misc: '🥷'
      };

      // 🧾 بناء القائمة
      const header = `╔═══───⊱༻⸸☽︎𓅇☾⸸༺⊰───═══╗
                    *⛥⃝𝕳𝕬𝕽𝕷𝕰𝖄༒︎*
\n`;
      let body = '';

      for (const [cat, commands] of Object.entries(categorized)) {
        const title = cat.toLowerCase();
        const icon = icons[title] || '📦';
        body += `\n╭──〔 ${icon} *${title.toUpperCase()}* 〕──╮\n`;
        body += commands.join('\n') + '\n╚═══───⊱༻⸸☽︎𓅇☾⸸༺⊰───═══╝\n';
      }

      const total = Object.values(categorized).flat().length;
      const footer = `\n╰━━〔 ⚙️ *${total} أمر* | 🎀 𝗕𝗬 ⛥⃝𝕳𝕬𝕽𝕷𝕰𝖄༒︎〕━━╯`;
      const menu = header + body + footer;

      // 🖼️ صورة البوت
      let botJid = sock.user.id.split(':')[0] + '@s.whatsapp.net';
      let pfp;
      try {
        pfp = await sock.profilePictureUrl(botJid, 'image');
      } catch {
        pfp = null;
      }

      if (pfp) {
        return await sock.sendMessage(msg.key.remoteJid, {
          image: { url: pfp },
          caption: menu
        }, { quoted: msg });
      }

      await sock.sendMessage(msg.key.remoteJid, { text: menu }, { quoted: msg });

    } catch (error) {
      console.error('❌ Menu Error:', error);
      await sock.sendMessage(msg.key.remoteJid, {
        text: '❌ حصل خطأ أثناء عرض قائمة الأوامر.'
      }, { quoted: msg });
    }
  }
};