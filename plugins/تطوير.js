const fs = require('fs');
const path = require('path');
const { isElite } = require('../haykala/elite');

module.exports = {
  command: 'عمك',
  description: '🔧 تبديل وضع التطوير (للنخبة فقط)',
  usage: '.تطوير',
  category: 'DEVELOPER',

  async execute(sock, msg) {
    try {
      const sender = msg.key.participant?.split('@')[0] || msg.key.remoteJid.split('@')[0];

      if (!isElite(sender)) {
        return sock.sendMessage(msg.key.remoteJid, {
          text: "⚠️ هذا الأمر مخصص للنخبة فقط 👑"
        }, { quoted: msg });
      }

      const devPath = path.join(__dirname, '../data/devmode.txt');
      let devMode = '[off]';

      if (fs.existsSync(devPath)) {
        devMode = fs.readFileSync(devPath, 'utf8').trim();
      }

      const newMode = devMode === '[on]' ? '[off]' : '[on]';
      fs.writeFileSync(devPath, newMode, 'utf8');

      let botProfilePic;
      try {
        botProfilePic = await sock.profilePictureUrl(sock.user.id, 'image');
      } catch {
        botProfilePic = 'https://i.imgur.com/8TnZ4Rv.png';
      }

      const messageText = newMode === '[on]'
        ? "🔧 الـعـم مـــجـــهـــول ｼ دخل وضع التطوير 💻\n\n🚫 أي حد مش نخبة مش هيقدر يستخدم الأوامر دلوقتي."
        : "✅ الـعـم مـــجـــهـــول ｼ خرج من وضع التطوير ✨\n\n💡 الأوامر رجعت شغالة مع الكل.";

      const message = {
        text: messageText,
        mentions: [msg.sender],
        contextInfo: {
          mentionedJid: [msg.sender],
          externalAdReply: {
            title: "مـــجـــهـــول ｼ Bot 🔧",
            body: newMode === '[on]' ? "Dev Mode Activated 🚀" : "Dev Mode Disabled 🌙",
            thumbnailUrl: botProfilePic,
            sourceUrl: `https://wa.me/963996097873`,
            mediaType: 1,
            renderLargerThumbnail: true
          }
        }
      };

      await sock.sendMessage(msg.key.remoteJid, message, { quoted: msg });

    } catch (error) {
      console.error('❌ Development Command Error:', error);
      await sock.sendMessage(msg.key.remoteJid, {
        text: '⚠️ حصل خطأ أثناء تنفيذ الأمر.'
      }, { quoted: msg });
    }
  }
};
