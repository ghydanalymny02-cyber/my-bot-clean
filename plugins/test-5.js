const fs = require('fs');
const path = require('path');

module.exports = {
  command: 'تستو',
  description: '⚙️ اختبار أداء البوت',
  usage: '.تستو2',
  category: 'ادوات',

  async execute(sock, msg) {
    try {
      const jid = msg.key?.remoteJid;
      const sender = msg.sender || msg.key?.participant;
      if (!jid) throw new Error('remoteJid غير موجود');
      if (!sender) throw new Error('sender غير موجود');

      let botProfilePic;
      try {
        botProfilePic = await sock.profilePictureUrl(sock.user.id, 'image');
      } catch {
        botProfilePic = 'https://i.imgur.com/8TnZ4Rv.png';
      }

      const messageText = `
*⛥⃝𝕳𝕬𝕽𝕷𝕰𝖄༒︎
⸄࿆࿆⸅ྃ⸄࿆⸅⸄῁̟࿆⸅ྃ⸄῁࿆⸅⸄῁̟࿆⸅ྃ⸄῁࿆⸅⸄῁̟࿆⸅ྃ⸄῁࿆⸅⸄῁̟࿆ ⸅𓊆†𓊇⸄῁࿆⸅⸄῁̟࿆⸅ྃ⸄῁࿆⸅⸄῁̟࿆⸅⸄῁࿆⸅⸄῁̟࿆⸅ྃ⸄῁࿆⸅⸄῁̟࿆⸅ྃ⸄࿆⸅⸄࿆࿆⸅ྃ
*༒︎𝕚𝕞 𝕙𝕖𝕣𝕖| (• ◡•)|*
*✔︎w̸o̸r̸k̸i̸n̸g̸.*
*◜🎀┆𝐈𝐃 : d͟o͟e͟s͟n͟t͟ e͟x͟i͟s͟t͟,y͟e͟t͟.*
⸄࿆࿆⸅ྃ⸄࿆⸅⸄῁̟࿆⸅ྃ⸄῁࿆⸅⸄῁̟࿆⸅ྃ⸄῁࿆⸅⸄῁̟࿆⸅ྃ⸄῁࿆⸅⸄῁̟࿆ ⸅𓊆†𓊇⸄῁࿆⸅⸄῁̟࿆⸅ྃ⸄῁࿆⸅⸄῁̟࿆⸅⸄῁࿆⸅⸄῁̟࿆⸅ྃ⸄῁࿆⸅⸄῁̟࿆⸅ྃ⸄࿆⸅⸄࿆࿆⸅ྃ
*⛥⃝𝕳𝕬𝕽𝕷𝕰𝖄༒︎*
      `.trim();

      const sentMessage = await sock.sendMessage(jid, {
        text: messageText,
        mentions: [sender],
        contextInfo: {
          mentionedJid: [sender],
          externalAdReply: {
            title: "⛥⃝𝕳𝕬𝕽𝕷𝕰𝖄༒︎",
            body: "𖣂𝘴𝘰𝘮𝘦𝘵𝘩𝘪𝘯𝘨 𝘪𝘯 𝘵𝘩𝘦 𝘸𝘢𝘺,𝘩𝘮𝘮.",
            thumbnailUrl: botProfilePic,
            sourceUrl: "none",
            mediaType: 1,
            renderLargerThumbnail: true
          }
        }
      }, { quoted: msg });

      const stickerPath = path.join(__dirname, '../sounds/stek2.webp');
      let sentSticker = null;
      if (fs.existsSync(stickerPath)) {
        const stickerBuffer = fs.readFileSync(stickerPath);
        sentSticker = await sock.sendMessage(jid, { sticker: stickerBuffer });
      } else {
        await sock.sendMessage(jid, { text: "⚠️ لم يتم العثور على الملصق stek2.webp في مجلد sounds." }, { quoted: msg });
      }

      const keysToReact = [msg.key, sentMessage.key];
      if (sentSticker) keysToReact.push(sentSticker.key);

      for (const key of keysToReact) {
        await sock.sendMessage(jid, { react: { text: '🎀', key } });
      }

    } catch (error) {
      console.error('❌ Test Command Error:', error);
      await sock.sendMessage(
        msg.key?.remoteJid || msg.chat || 'status@broadcast',
        { text: `⚠️ حدث خطأ أثناء تنفيذ الأمر:\n${error.message || error.toString()}` },
        { quoted: msg }
      );
    }
  }
};