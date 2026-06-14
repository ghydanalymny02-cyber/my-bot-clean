const fs = require('fs');
const path = require('path');
const { getPlugins } = require('../handlers/plugins.js');
const axios = require('axios');

module.exports = {
  status: "on",
  name: 'Bot Commands',
  command: ['الاوامر'],
  category: 'tools',
  description: 'قائمة الأوامر بحسب الفئة',
  hidden: false,
  version: '3.0',

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
        if (Array.isArray(plugin.command) && plugin.command.length > 1) {
          commandDisplay = `- ${plugin.command.map(cmd => `\`${cmd}\``).join(' - ')}`;
        } else {
          const cmd = Array.isArray(plugin.command) ? plugin.command[0] : plugin.command;
          commandDisplay = `- \`${cmd}\``;
        }

        if (plugin.description) {
          commandDisplay += `\nالوصف: \`\`\`${plugin.description}\`\`\``;
        }

        categories[category].push(commandDisplay + '\n');
      });

      const now = new Date();
      const timeStr = now.toLocaleTimeString('ar-EG');
      const uptimeSeconds = process.uptime();
      const uptimeStr = new Date(uptimeSeconds * 1000).toISOString().substr(11, 8);
      const dateStr = now.toLocaleDateString('ar-EG', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
      const weekday = now.toLocaleDateString('ar-EG', { weekday: 'long' });

      let menu = `> *❐━━━━━⌬〔 💫 〕⌬━━━━❐*
*（魂）』⚜️ *〘•❄ مــجــهــول||𝕲𝕳𝕰𝕯𝕬𝕹 𝑩𝒐𝒕꧂•〙🎖『BOT』*⚜️
*❐━━━━━⌬〘🌋〙⌬━━━━❐*\n\n`;
      menu += `┃⧉↵ ٭ حياة هانئة ⚜️ ٭ ↯🐦‍🔥\n`;
      menu += `*❐─━──━〘•⚜️•〙━──━─❐*\n`;
      menu += `┃╻قـبــل کــل امــر ضــع ↜ ❮ • ❯╹\n`;
      menu += `┃╻❮ ˼لـشـرح الأوامـر اكــتــب ˼.شـرح˹ ❯╹\n`;
      menu += `┃╻❮ تــواصــل مــع الــمــطــور ˼ .مطور ❯╹\n`;
      menu += `┃╻❮ قــائــمــة الأقسام ❯ ↯╹\n`;
      menu += `┣┅ ━━━━━━━━━━━━━━━ ┅ ━┫\n`;
      menu += `┃⏰ الوقت : ${timeStr}\n`;
      menu += `┃⌛ مدة التشغيل : ${uptimeStr}\n`;
      menu += `┃📆 التاريخ : ${dateStr}\n`;
      menu += `┃📅 اليوم : ${weekday}\n`;
      menu += `*❐─━──━〘•🔰•〙━──━─❐*\n`;

      if (args.length === 0) {
        menu += `┃📍 الأقسام:\n`;
        menu += `1️⃣\n\n`;
        menu += `*❍•━━❆┇•الفئات المتوفرة•┇❆━━•❍*\n
        `;
        for (const cat of Object.keys(categories)) {
          menu += `🔰 *〘•* \*${cat}\*\n`;
        }
        menu += `*╰──────────────*\n\n`;
        menu += `اكتب \`.اوامر [فئة]\` لعرض أوامرها.\n`;
        menu += `*واتمنى يكون فادك *
        \n`;
      } else {
        const requestedCategory = args.join(' ').toLowerCase();
        if (!categories[requestedCategory]) {
          return await sock.sendMessage(msg.key.remoteJid, {
            text: `❌ الفئة *${requestedCategory}* غير موجودة.\nاكتب \`.اوامر\` لعرض الفئات.`,
            mentions: [sender]
          }, { quoted: msg });
        }

        menu += `*❐─━──━〘•🔰•〙━──━─❐*\n\n`;
        menu += `╭─❒ *${requestedCategory}*\n`;
        menu += categories[requestedCategory].join('\n');
        menu += `╰──\n\n`;
        menu += ` *〘•❄ مــجــهــول||𝕲𝕳𝕰𝕯𝕬𝕹 •〙🔰\n`;
      }

      menu += `*❍•━━━❆┇•🔰•┇❆━━━•❍*\n`;
      menu += `\n\n`;
      menu += `\n\n`;
      menu += `🥇 *〘•❄ مــجــهــول||𝕲𝕳𝕰𝕯𝕬𝕹 •〙🔰『𝑩𝒐𝒕꧂』*🔰`;

      // جلب صورة البروفايل سواء جروب أو خاص
      let imageBuffer = null;
      try {
        let jidToFetch = msg.key.remoteJi
d;
        if (!msg.key.remoteJid.endsWith('@g.us')) {
          jidToFetch = msg.key.participant || msg.key.remoteJid;
        }
        const pfpUrl = await sock.profilePictureUrl(jidToFetch, 'image');
        if (pfpUrl) {
          const res = await axios.get(pfpUrl, { responseType: 'arraybuffer' });
          imageBuffer = Buffer.from(res.data, 'binary');
        }
      } catch (e) {}

      if (!imageBuffer) {
        const fallbackPath = path.join(process.cwd(), 'com.jpeg');
        if (fs.existsSync(fallbackPath)) {
          imageBuffer = fs.readFileSync(fallbackPath);
        }
      }

      const isGroup = msg.key.remoteJid.endsWith('@g.us');

      if (isGroup) {
        if (imageBuffer) {
          await sock.sendMessage(msg.key.remoteJid, {
            image: imageBuffer,
            caption: menu,
            mentions: [sender]
          }, { quoted: msg });
        } else {
          await sock.sendMessage(msg.key.remoteJid, {
            text: menu,
            mentions: [sender]
          }, { quoted: msg });
        }
      } else {
        await sock.sendMessage(msg.key.remoteJid, {
          text: menu,
          contextInfo: {
            externalAdReply: {
              title: " *〘•❄ مــجــهــول||𝕲𝕳𝕰𝕯𝕬𝕹 •〙👁️",
              body: "قائمة الأوامر حسب الفئة",
              thumbnail: imageBuffer || null,
              mediaType: 1,
              sourceUrl: "https://t.me/Sanji_Bot_Channel",
              renderLargerThumbnail: false,
              showAdAttribution: true
            }
          }
        }, { quoted: msg });
      }

    } catch (error) {
      console.error('❌ Menu Error:', error);
      await sock.sendMessage(msg.key.remoteJid, { text: '❌ حدث خطأ أثناء إنشاء القائمة.' }, { quoted: msg });
    }
  }
};