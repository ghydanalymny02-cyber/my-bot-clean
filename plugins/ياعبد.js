module.exports = {
  command: 'ياعبد',
  description: '⚙️ اختبار أداء البوت',
  usage: 'ياعبد',
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
الـعـم مــجــهــول||𝕲𝕳𝕰𝕯𝕬𝕹 يـعـمـل و شـقـيـان
      
*- مــجــهــول||𝕲𝕳𝕰𝕯𝕬𝕹 𝑩𝑶𝑻*`.trim();

      const message = {
        text: messageText,
        mentions: [msg.sender],
        contextInfo: {
          mentionedJid: [msg.sender],
          externalAdReply: {
            title: "مــجــهــول||𝕲𝕳𝕰𝕯𝕬𝕹 يتحدث 🫦",
            body: "𝑹𝒆𝒂𝒅𝒚 𝑭𝒐𝒓 𝑨𝒄𝒕𝒊𝒐𝒏 🔥",
            thumbnailUrl: botProfilePic,
            sourceUrl: `https://wa.me/963996097873`,
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