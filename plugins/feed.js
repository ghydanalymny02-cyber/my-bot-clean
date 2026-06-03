const { downloadMediaMessage } = require('@whiskeysockets/baileys');
const fs = require('fs');
const { exec } = require('child_process');
const path = require('path');

module.exports = {
  command: ['فيد'],
  description: 'تحويل الملصق المتحرك إلى فيديو',
  category: 'الميديا',
  async execute(sock, msg) {
    try {
      if (!msg.message?.extendedTextMessage?.contextInfo?.quotedMessage?.stickerMessage) {
        await sock.sendMessage(msg.key.remoteJid, { text: '❌ رد على ملصق متحرك بالأمر .فيد' }, { quoted: msg });
        return;
      }

      const stickerMessage = msg.message.extendedTextMessage.contextInfo.quotedMessage;
      const quoted = {
        key: msg.message.extendedTextMessage.contextInfo.stanzaId,
        message: stickerMessage,
      };

      const mediaBuffer = await downloadMediaMessage(
        { key: { remoteJid: msg.key.remoteJid, id: quoted.key, fromMe: false }, message: stickerMessage },
        'buffer',
        {},
        { logger: console, reuploadRequest: sock.updateMediaMessage }
      );

      const inputPath = './temp/input.webp';
      const outputPath = './temp/output.mp4';

      fs.writeFileSync(inputPath, mediaBuffer);

      const ffmpegCmd = `ffmpeg -y -i ${inputPath} -movflags faststart -pix_fmt yuv420p ${outputPath}`;
      exec(ffmpegCmd, async (error) => {
        if (error) {
          console.error(error);
          await sock.sendMessage(msg.key.remoteJid, { text: '❌ فشل تحويل الملصق إلى فيديو. تأكد من دعم ffmpeg.' }, { quoted: msg });
          return;
        }

        const videoBuffer = fs.readFileSync(outputPath);
        await sock.sendMessage(msg.key.remoteJid, { video: videoBuffer, caption: '🎥 تم تحويل الملصق إلى فيديو بنجاح', mimetype: 'video/mp4' }, { quoted: msg });

        fs.unlinkSync(inputPath);
        fs.unlinkSync(outputPath);
      });
    } catch (err) {
      console.error(err);
      await sock.sendMessage(msg.key.remoteJid, { text: '❌ حدث خطأ أثناء تنفيذ الأمر.' }, { quoted: msg });
    }
  }
};