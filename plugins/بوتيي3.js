// *حقوق مطورة يوميلا 🛡*
// 📄 *بوتيي3.js*

const fs = require('fs');
const { join } = require('path');
const { getPlugins } = require('../handlers/plugins');

module.exports = {
  command: ['بوتيي3'],
  description: '⚙️ يعرض معلومات البوت مع مدح خاص ليوميلا بأسلوب جديد',
  category: 'tools',

  async execute(sock, msg) {
    try {
      // ملف إعدادات التفاعل
      const zarfPath = join(process.cwd(), 'zarf.json');
      let zarfData = { reaction_status: "on", reaction: "🌟" };

      if (fs.existsSync(zarfPath)) {
        zarfData = JSON.parse(fs.readFileSync(zarfPath));
      }

      // إرسال تفاعل 🌟
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

      // النص مع مدح مختلف ليوميلا
      const infoText = `
╭──〔 🌟 𝗕𝗢𝗧𝗜𝗬𝗬 𝟯 〕──╮
┃ 👑 الاسم: *بوتيي3*
┃ 📦 الأوامر: *${totalCommands}*
┃ 🛠️ الإصدار: *3.0*
┃ 👑 المطور: *يوميلا*
┃ 🌸 المدح: *يوميلا هي النور الذي يرشد البوت*
┃ 📅 التاريخ: *${new Date().toLocaleDateString('ar-EG')}*
┃ 🧠 اللغة: *Node.js (Baileys)*
╰━━━━━━━━━━━━━━╯

💫 « يوميلا… حضورك يضيء الطريق ويمنح البوت طاقة لا تنطفئ. »
`.trim();

      // الرسالة مع معاينة خارجية
      const message = {
        text: infoText,
        contextInfo: {
          externalAdReply: {
            title: "🌟 بوتيي3",
            body: "مدح مختلف ليوميلا",
            thumbnailUrl: botProfilePic,
            sourceUrl: 'https://wa.me/963996097873',
            mediaType: 1,
            renderLargerThumbnail: true
          }
        }
      };

      await sock.sendMessage(msg.key.remoteJid, message, { quoted: msg });

    } catch (err) {
      console.error('❌ خطأ في أمر بوتيي3:', err);
      await sock.sendMessage(msg.key.remoteJid, {
        text: '❌ حصل خطأ أثناء عرض معلومات بوتيي3.'
      }, { quoted: msg });
    }
  }
};