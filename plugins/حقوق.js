const { downloadContentFromMessage } = require('@whiskeysockets/baileys');

module.exports = {
  command: 'حقوقي',
  async execute(sock, m) {
    try {
      const quoted = m.message?.extendedTextMessage?.contextInfo?.quotedMessage;
      const sticker = quoted?.stickerMessage;

      if (!quoted || !sticker) {
        return await sock.sendMessage(m.key.remoteJid, {
          text: '⚠️ من فضلك رد على ملصق لاستخدام هذا الأمر.',
        }, { quoted: m });
      }

      const stream = await downloadContentFromMessage(sticker, 'sticker');
      let buffer = Buffer.from([]);
      for await (const chunk of stream) buffer = Buffer.concat([buffer, chunk]);

      await sock.sendMessage(m.key.remoteJid, { 
        sticker: buffer,
      }, { quoted: m });

      await sock.sendMessage(m.key.remoteJid, {
        text: `
*❐─━──━〘•🕸️•〙━──━─❐*
✦ الحقوق:  مــجــهــول||𝕲𝕳𝕰𝕯𝕬𝕹⊰𝑩𝑶𝑻 ❄ ✦
*❐─━──━〘•🕸️•〙━──━─❐*`,
      }, { quoted: m });

    } catch (err) {
      console.error(err);
      await sock.sendMessage(m.key.remoteJid, { text: '⚠️ حدث خطأ أثناء المعالجة.' }, { quoted: m });
    }
  }
};