// *حقوق مطور مــجــهــول||𝕲𝕳𝕰𝕯𝕬𝕹 🛡*
// 📄 *فايوليت2.js*

const fs = require('fs');
const { join } = require('path');
const { getPlugins } = require('../handlers/plugins');

module.exports = {
  command: ['فايوليت2'],
  description: '⚙️ يعرض معلومات البوت باسم مــجــهــول||𝕲𝕳𝕰𝕯𝕬𝕹 الموحد',
  category: 'tools',

  async execute(sock, msg) {
    try {
      const zarfPath = join(process.cwd(), 'zarf.json');
      let zarfData = { reaction_status: "on", reaction: "❄️" };

      if (fs.existsSync(zarfPath)) {
        zarfData = JSON.parse(fs.readFileSync(zarfPath));
      }

      if (zarfData.reaction_status === "on" && zarfData.reaction) {
        await sock.sendMessage(msg.key.remoteJid, {
          react: { text: zarfData.reaction, key: msg.key }
        }).catch(() => {});
      }

      const plugins = getPlugins();
      const totalCommands = Object.values(plugins).filter(p => !p.hidden).length;

      const botJid = sock.user.id.split(':')[0] + '@s.whatsapp.net';
      let botProfilePic = 'https://i.imgur.com/xyz123.png';
      try {
        botProfilePic = await sock.profilePictureUrl(botJid, 'image');
      } catch {}

      const infoText = `
╭──〔 ❄ مــجــهــول||𝕲𝕳𝕰𝕯𝕬𝕹 𝑩𝒐𝒕꧂ 〕──╮
┃ 📦 الأوامر: *${totalCommands}*
┃ 🛠️ الإصدار: *1.0*
┃ 👑 المطور: *مــجــهــول||𝕲𝕳𝕰𝕯𝕬𝕹*
┃ 📅 التاريخ: *${new Date().toLocaleDateString('ar-EG')}*
┃ 🧠 اللغة: *Node.js (Baileys)*
╰━━━━━━━━━━━━━━╯

✨ « فايوليت2… أمر يضيف للبوت سحرًا مضاعفًا، كزهر البنفسج الذي يزهر مرتين ليعكس هيبة ❄ مــجــهــول||𝕲𝕳𝕰𝕯𝕬𝕹 𝑩𝒐𝒕꧂. »
`.trim();

      const message = {
        text: infoText,
        contextInfo: {
          externalAdReply: {
            title: "❄ مــجــهــول||𝕲𝕳𝕰𝕯𝕬𝕹 𝑩𝒐𝒕꧂",
            body: "معلومات البوت",
            thumbnailUrl: botProfilePic,
            sourceUrl: 'https://wa.me/967715677073',
            mediaType: 1,
            renderLargerThumbnail: true
          }
        }
      };

      await sock.sendMessage(msg.key.remoteJid, message, { quoted: msg });

    } catch (err) {
      console.error('❌ خطأ في أمر فايوليت2:', err);
      await sock.sendMessage(msg.key.remoteJid, {
        text: '❌ حصل خطأ أثناء عرض معلومات فايوليت2.'
      }, { quoted: msg });
    }
  }
};