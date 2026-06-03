// 👑 𝟕𝐀𝐑𝐁ｼ-BOT | أوامر الفئات بتنسيق فخم
const fs = require('fs');
const path = require('path');
const { getPlugins } = require('../handlers/plugins.js');
const axios = require('axios');

module.exports = {
  status: "on",
  name: 'Bot Commands',
  command: ['فئة'],
  category: 'tools',
  description: 'قائمة الأوامر بحسب الفئة',
  hidden: false,
  version: '3.1',

  async execute(sock, msg) {
    try {
      const zarfData = JSON.parse(fs.readFileSync(path.join(process.cwd(), 'zarf.json')));
      const body = msg.message?.extendedTextMessage?.text || msg.message?.conversation || '';
      const args = body.trim().split(' ').slice(1);
      const plugins = getPlugins();
      const categories = {};

      const sender = msg.key.participant || msg.key.remoteJid;
      const number = sender.split('@')[0];

      Object.values(plugins).forEach((plugin) => {
        if (plugin.hidden) return;
        const category = plugin.category?.toLowerCase() || 'others';
        if (!categories[category]) categories[category] = [];

        let commandDisplay = '';
        const commands = Array.isArray(plugin.command) ? plugin.command : [plugin.command];
        commandDisplay += `╭── ❍ ${commands.map(cmd => `\`${cmd}\``).join(' | ')}`;
        if (plugin.description) {
          commandDisplay += `\n│ 📌 الوصف: ${plugin.description}`;
        }
        commandDisplay += `\n╰───────────────\n`;

        categories[category].push(commandDisplay);
      });

      const now = new Date();
      const timeStr = now.toLocaleTimeString('ar-EG');
      const uptimeStr = new Date(process.uptime() * 1000).toISOString().substr(11, 8);
      const dateStr = now.toLocaleDateString('ar-EG', { year: 'numeric', month: 'long', day: 'numeric' });
      const weekday = now.toLocaleDateString('ar-EG', { weekday: 'long' });

      let menu = `❄ 𝒀𝑼𝑴𝑰𝑳𝑨 𝑩𝒐𝒕꧂𝓿3 ━━━━━━━━━━━\n`;
      menu += `✦ أهلاً بك @${number} ✦\n`;
      menu += `━━━━━━━━━━━━━━━━━━\n`;
      menu += `📆 التاريخ: ${dateStr} (${weekday})\n`;
      menu += `⏰ الوقت: ${timeStr}\n`;
      menu += `🧭 مدة التشغيل: ${uptimeStr}\n`;
      menu += `━━━━━━━━━━━━━━━━━━\n`;

      if (args.length === 0) {
        menu += `📂 *الأقسام المتوفرة:*\n\n`;
        Object.keys(categories).forEach((cat, i) => {
          menu += `❄ ${i + 1}. \`${cat}\`\n`;
        });
        menu += `\n🧾 اكتب: \`.menu [الفئة]\` لعرض أوامرها\n`;
      } else {
        const requestedCategory = args.join(' ').toLowerCase();
        if (!categories[requestedCategory]) {
          return await sock.sendMessage(msg.key.remoteJid, {
            text: `🚫 الفئة *${requestedCategory}* غير موجودة.\nاكتب \`.اوامر\` لعرض الأقسام.`,
            mentions: [sender]
          }, { quoted: msg });
        }

        menu += `📂 *أوامر الفئة: ${requestedCategory}*\n\n`;
        menu += categories[requestedCategory].join('\n');
      }

      menu += `━━━━━━━━━━━━━━━━━━\n`;
      menu += `🌐 الدعم الفني:\n`;
      menu += `🔗 https://chat.whatsapp.com/IXhdjJ8oz7tDxCd7sFwRkx?mode=r_c\n`;
      menu += `━━━━━━━━━━━━━━━━━━\n`;
      menu += ` *〘•❄ 𝒀𝑼𝑴𝑰𝑳𝑨 𝑩𝒐𝒕꧂•〙`;

      // 👑 صورة العرض إن وُجدت
      let imageBuffer = null;
      try {
        let jidToFetch = msg.key.remoteJid;
        if (!jidToFetch.endsWith('@g.us')) {
          jidToFetch = msg.key.participant || msg.key.remoteJid;
        }
        const pfpUrl = await sock.profilePictureUrl(jidToFetch, 'image');
        if (pfpUrl) {
          const res = await axios.get(pfpUrl, { responseType: 'arraybuffer' });
          imageBuffer = Buffer.from(res.data, 'binary');
        }
      } catch {}

      if (!imageBuffer && fs.existsSync(path.join(process.cwd(), 'image.jpeg'))) {
        imageBuffer = fs.readFileSync(path.join(process.cwd(), 'image.jpeg'));
      }

      const isGroup = msg.key.remoteJid.endsWith('@g.us');

      if (isGroup) {
        await sock.sendMessage(msg.key.remoteJid, {
          image: imageBuffer,
          caption: menu,
          mentions: [sender]
        }, { quoted: msg });
      } else {
        await sock.sendMessage(msg.key.remoteJid, {
          text: menu,
          contextInfo: {
            externalAdReply: {
              title: " 𝒀𝑼𝑴𝑰𝑳𝑨ｼ 𝑩𝑶𝑻 ❄",
              body: "أوامر البوت حسب الفئة",
              thumbnail: imageBuffer || null,
              mediaType: 1,
              sourceUrl: "https://t.me",
              renderLargerThumbnail: true,
              showAdAttribution: true
            }
          }
        }, { quoted: msg });
      }

    } catch (error) {
      console.error('❌ Menu Error:', error);
      await sock.sendMessage(msg.key.remoteJid, {
        text: '❌ حدث خطأ أثناء عرض الأوامر.'
      }, { quoted: msg });
    }
  }
};