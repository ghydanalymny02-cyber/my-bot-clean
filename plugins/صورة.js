const { downloadMediaMessage } = require('@whiskeysockets/baileys');
const fs = require('fs');
const path = require('path');
const { writeFile } = require('fs/promises');

module.exports = {
  command: 'صورة',
  description: '🖼️ يحوّل الاستيكر إلى صورته الأصلية',
  category: 'tools',

  async execute(sock, msg, args = []) {
    try {
      const quoted = msg.message?.extendedTextMessage?.contextInfo?.quotedMessage;
      const isSticker = quoted?.stickerMessage;

      if (!quoted || !isSticker) {
        return sock.sendMessage(msg.key.remoteJid, {
          text: '📌 من فضلك رد على استيكر علشان أقدر أحوله لصورة.'
        }, { quoted: msg });
      }

      const mediaBuffer = await downloadMediaMessage(
        { key: msg.message.extendedTextMessage.contextInfo.stanzaId, message: quoted },
        'buffer',
        {},
        { logger: console }
      );

      const imagePath = path.join(__dirname, 'sticker.png');
      await writeFile(imagePath, mediaBuffer);

      await sock.sendMessage(msg.key.remoteJid, {
        image: { url: imagePath },
        caption: '🖼️ الصورة الأصلية للاستيكر'
      }, { quoted: msg });

      fs.unlinkSync(imagePath);

    } catch (err) {
      return sock.sendMessage(msg.key.remoteJid, {
        text: `❌ حصل خطأ:\n${err.message || err.toString()}`
      }, { quoted: msg });
    }
  }
};