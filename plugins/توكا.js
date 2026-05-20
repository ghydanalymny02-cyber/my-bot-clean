// *حقوق مطورة يوميلا 🛡*
// 📄 *توكا.js*

const fs = require('fs');
const { join } = require('path');
const { getPlugins } = require('../handlers/plugins');

module.exports = {
  command: ['توكا'],
  description: '⚙️ يعرض معلومات البوت باسم توكا',
  category: 'tools',

  async execute(sock, msg) {
    try {
      // ملف إعدادات التفاعل
      const zarfPath = join(process.cwd(), 'zarf.json');
      let zarfData = { reaction_status: "on", reaction: "🪽" };

      if (fs.existsSync(zarfPath)) {
        zarfData = JSON.parse(fs.readFileSync(zarfPath));
      }

      // إرسال تفاعل 🪽
      if (zarfData.reaction_status === "on" && zarfData.reaction) {
        await sock.sendMessage(msg.key.remoteJid, {
          react: { text: zarfData.reaction, key: msg.key }
        }).catch(() => {});
      }

      // عداد الأوامر
      const plugins = getPlugins();
      const totalCommands = Object.values(plugins).filter(p => !p.hidden).length;

      // صورة البوت
      const botJid = sock.user.id.split(':')[0] + '@s.whatsapp.net';
      let botProfilePic = 'https://i.imgur.com/xyz123.png';
      try {
        botProfilePic = await sock.profilePictureUrl(botJid, 'image');
      } catch {}

      // النص
      const infoText = `
╭──〔 🪽 𝗧𝗢𝗨𝗞𝗔 𝗕𝗢𝗧 〕──╮
┃ 👑 الاسم: *توكا*
┃ 📦 الأوامر: *${totalCommands}*
┃ 🛠️ الإصدار: *1.0*
┃ 👑 المطور: *يوميلا*
┃ 📅 التاريخ: *${new Date().toLocaleDateString('ar-EG')}*
┃ 🧠 اللغة: *Node.js (Baileys)*
╰━━━━━━━━━━━━━━╯

✨ « توكا… اسم يضيف للبوت لمسة من الغموض والقوة الهادئة. »
`.trim();

      // الرسالة مع معاينة خارجية
      const message = {
        text: infoText,
        contextInfo: {
          externalAdReply: {
            title: "🪽 توكا بوت",
            body: "معلومات البوت",
            thumbnailUrl: botProfilePic,
            sourceUrl: 'https://wa.me/963996097873',
            mediaType: 1,
            renderLargerThumbnail: true
          }
        }
      };

      await sock.sendMessage(msg.key.remoteJid, message, { quoted: msg });

    } catch (err) {
      console.error('❌ خطأ في أمر توكا:', err);
      await sock.sendMessage(msg.key.remoteJid, {
        text: '❌ حصل خطأ أثناء عرض معلومات توكا.'
      }, { quoted: msg });
    }
  }
};