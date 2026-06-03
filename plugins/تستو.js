module.exports = {
  command: 'تستو',
  description: '⚙️ اختبار أداء البوت',
  usage: '.تست',
  category: 'tools',

  async execute(sock, msg) {
    try {
      let botProfilePic;
      try {
        botProfilePic = await sock.profilePictureUrl(sock.user.id, 'image');
      } catch {
        botProfilePic = 'https://i.imgur.com/8TnZ4Rv.png';
      }

      const messageText = `
*⛥⃝𝕳𝕬𝕽𝕷𝕰𝖄༒︎*
━━━━━━━━━━━━━━
✅ *Online*
🎀 *Power : MAX*
🆔 *ID :* $+212679-887428:6@s.whatsapp.net
━━━━━━━━━━━━━━
_࣪ ִֶָ☾.weeee..._
      `.trim();

      const message = {
        text: messageText,
        mentions: [msg.sender],
        contextInfo: {
          mentionedJid: [msg.sender],
          externalAdReply: {
            title: "🎀🅑︎🅞︎🅣︎. ⛥⃝𝕳𝕬𝕽𝕷𝕰𝖄༒︎",
            body: "Ⓦ︎Ⓐ︎Ⓘ︎Ⓣ︎Ⓘ︎Ⓝ︎Ⓖ︎ Ⓕ︎Ⓞ︎Ⓡ︎ Ⓐ︎ Ⓢ︎Ⓘ︎Ⓝ︎Ⓔ︎.",
            thumbnailUrl: botProfilePic,
            sourceUrl: `none`,
            mediaType: 1,
            renderLargerThumbnail: true
          }
        }
      };

      await sock.sendMessage(msg.key.remoteJid, message, { quoted: msg });

    } catch (error) {
      console.error('❌ Test Command Error:', error);
      await sock.sendMessage(msg.key.remoteJid, {
        text: '⚠️ حدث خطأ أثناء تنفيذ الأمر.',
      }, { quoted: msg });
    }
  }
};