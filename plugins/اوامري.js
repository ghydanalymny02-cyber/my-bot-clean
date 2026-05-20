// 📄 اوامري.js - أمر لعرض جميع أوامر البوت بطريقة منظمة
const { getPlugins } = require('../handlers/plugins.js');
const fs = require('fs').promises;
const path = require('path');

module.exports = {
  status: "on",
  name: 'أوامر البوت',
  command: ['اوامري'],
  category: 'tools',
  description: '📜 قائمة بجميع أوامر البوت',
  hidden: false,
  version: '4.0',

  async execute(sock, msg) {
    try {
      // 📜 الريأكشن
      try {
        const zarfPath = path.join(process.cwd(), 'zarf.json');
        if (await fs.access(zarfPath).then(() => true).catch(() => false)) {
          const zarfData = JSON.parse(await fs.readFile(zarfPath, 'utf8'));
          if (zarfData.reaction_status === "on" && zarfData.reaction) {
            await sock.sendMessage(msg.key.remoteJid, {
              react: { text: zarfData.reaction, key: msg.key }
            }).catch(() => {});
          }
        }
      } catch (e) {
        // تجاهل خطأ ملف zarf.json
      }

      // 🧩 جلب الأوامر
      let plugins;
      try {
        plugins = getPlugins();
      } catch (error) {
        console.error('❌ خطأ في جلب الأوامر:', error);
        plugins = {};
      }

      const categorized = {};

      // 🧠 إيموجي مخصص لكل أمر
      const commandEmojis = {
        'طرد': '🚫',
        'استعد': '♻️',
        'بان': '🔒',
        'الغاء': '🔓',
        'اوامر': '📜',
        'اوامري': '📜',
        'فنش': '💣',
        'مغادره': '👋',
        'ترحيب': '🎉',
        'جروب': '👥',
        'xo': '❌⭕',
        'كتابة': '✍️',
        'قلب': '🎰',
        'روليت': '🔫',
        'سؤال': '❓',
        'حظ': '🔮',
        'نكتة': '😂',
        'تحدي': '🏆',
        'قصة_رعب': '👻',
        'كابوس': '😱',
        'اسطوره': '🐉',
        'حب': '❤️',
        'نصيحه': '💡',
        'تحفيز': '💪',
        'معلومه_غريبه': '🤯',
        'بينج': '🏓',
        'الوقت': '🕰️',
        'صورتي': '🖼️',
        'معلوماتي': '👤'
      };

      // 🎭 رموز للفئات
      const categoryIcons = {
        'admin': '🛡️',
        'tools': '🛠️',
        'games': '🎮',
        'fun': '🎭',
        'media': '🖼️',
        'group': '👥',
        'DEVELOPER': '👑',
        'developer': '👑',
        'INFO': '✨',
        'info': '✨',
        'ترفيه': '🎮',
        'ديني': '📿',
        'معلومات': '🧠',
        'edit': '🍷',
        'EDIT': '🍷',
        'AI': '🤖',
        'ai': '🤖',
        'misc': '📦',
        'رعب': '👻',
        'أخرى': '💡',
        'أدوات': '🔧'
      };

      // تصنيف الأوامر
      for (const plugin of Object.values(plugins)) {
        if (plugin.hidden || !plugin.command) continue;
        
        const cat = plugin.category ? String(plugin.category).toLowerCase() : 'misc';
        if (!categorized[cat]) categorized[cat] = [];

        const cmds = Array.isArray(plugin.command) ? plugin.command : [plugin.command];
        
        for (const cmd of cmds) {
          if (!cmd || typeof cmd !== 'string') continue;
          
          const emoji = commandEmojis[cmd.toLowerCase()] || commandEmojis[cmd] || '•';
          const desc = plugin.description || 'لا يوجد وصف';
          
          let commandText = `⎯ ❖ ${emoji} *${cmd}*`;
          if (plugin.usage) {
            commandText += ` ${plugin.usage}`;
          }
          commandText += ` - ${desc}`;
          
          categorized[cat].push(commandText);
        }
      }

      // 🧾 بناء القائمة
      const header = `╭━━━〔 𓆩 ❄ 𝒀𝑼𝑴𝑰𝑳𝑨  𝑩𝒐𝒕꧂❄ 〕━━━╮\n`;
      let body = '';
      let totalCommands = 0;

      // ترتيب التصنيفات
      const orderedCategories = [
        'DEVELOPER', 'developer', 'admin',
        'tools', 'أدوات',
        'games', 'fun', 'ترفيه',
        'رعب',
        'misc', 'أخرى', 'معلومات', 'info', 'INFO'
      ];

      // إضافة التصنيفات بالترتيب المحدد
      for (const cat of orderedCategories) {
        if (categorized[cat] && categorized[cat].length > 0) {
          const icon = categoryIcons[cat] || '📦';
          const catName = cat === 'misc' ? 'متنوع' : 
                         cat === 'fun' ? 'ترفيه' :
                         cat === 'info' ? 'معلومات' :
                         cat === 'INFO' ? 'معلومات' : cat;
          
          body += `\n╭──〔 ${icon} *${catName.toUpperCase()}* 〕──╮\n`;
          body += categorized[cat].join('\n') + '\n';
          body += `╰${'─'.repeat(18)}╯\n`;
          
          totalCommands += categorized[cat].length;
          delete categorized[cat]; // إزالة من القائمة
        }
      }

      // إضافة أي تصنيفات باقية
      for (const [cat, commands] of Object.entries(categorized)) {
        if (commands.length > 0) {
          const icon = categoryIcons[cat] || '📦';
          body += `\n╭──〔 ${icon} *${cat.toUpperCase()}* 〕──╮\n`;
          body += commands.join('\n') + '\n';
          body += `╰${'─'.repeat(18)}╯\n`;
          
          totalCommands += commands.length;
        }
      }

      const footer = `\n╰━━〔 ⚙️ *${totalCommands} أمر* | 🥇 𝗕𝗬 ❄ 𝒀𝑼𝑴𝑰𝑳𝑨 ꧂ 〕━━╯`;
      const menu = header + body + footer;

      // 🖼️ محاولة إرسال مع صورة البوت
      try {
        const botJid = sock.user?.id?.split(':')[0] + '@s.whatsapp.net';
        if (botJid && botJid.includes('@s.whatsapp.net')) {
          const pfp = await sock.profilePictureUrl(botJid, 'image').catch(() => null);
          
          if (pfp) {
            return await sock.sendMessage(msg.key.remoteJid, {
              image: { url: pfp },
              caption: menu
            }, { quoted: msg });
          }
        }
      } catch (pfpError) {
        // تجاهل خطأ صورة البوت
      }

      // إرسال كرسالة نصية
      await sock.sendMessage(msg.key.remoteJid, { 
        text: menu 
      }, { quoted: msg });

    } catch (error) {
      console.error('❌ خطأ في أمر اوامري:', error);
      
      // رسالة خطأ بديلة
      const errorMessage = `❌ *حدث خطأ أثناء عرض الأوامر*\n\n` +
                         `🔧 *السبب:* ${error.message || 'غير معروف'}\n\n` +
                         `💡 *الحلول:*\n` +
                         `1. تأكد من وجود ملفات الأوامر\n` +
                         `2. حاول مرة أخرى\n` +
                         `3. اتصل بالمطور إذا استمر الخطأ`;
      
      await sock.sendMessage(msg.key.remoteJid, {
        text: errorMessage
      }, { quoted: msg });
    }
  }
};