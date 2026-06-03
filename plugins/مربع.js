const { downloadContentFromMessage } = require('@whiskeysockets/baileys');
const fs = require('fs');
const { exec } = require('child_process');
const path = require('path');

module.exports = {
  command: 'مربع',
  description: 'يقص الصورة من المنتصف لتصبح مربعة',
  category: 'image',

  async execute(sock, msg) {
    const quoted = msg.message?.extendedTextMessage?.contextInfo?.quotedMessage;
    const imageMessage = quoted?.imageMessage;

    if (!imageMessage) {
      return await sock.sendMessage(msg.key.remoteJid, {
        text: '❗ رد على صورة علشان أخليها مربعة بالشكل الصح 💠'
      }, { quoted: msg });
    }

    const stream = await downloadContentFromMessage(imageMessage, 'image');
    const buffer = [];
    for await (const chunk of stream) buffer.push(chunk);
    const imageBuffer = Buffer.concat(buffer);

    const tempIn = path.join(__dirname, '../temp/input.jpg');
    const tempOut = path.join(__dirname, '../temp/output.jpg');
    fs.writeFileSync(tempIn, imageBuffer);

    // ffprobe عشان نجيب الأبعاد
    const getSizeCmd = `ffprobe -v error -select_streams v:0 -show_entries stream=width,height -of csv=p=0 "${tempIn}"`;
    exec(getSizeCmd, (err, stdout) => {
      if (err) {
        return sock.sendMessage(msg.key.remoteJid, { text: '❌ فشل الحصول على أبعاد الصورة' }, { quoted: msg });
      }

      const [width, height] = stdout.trim().split(',').map(Number);
      const size = Math.min(width, height);
      const x = Math.floor((width - size) / 2);
      const y = Math.floor((height - size) / 2);

      const cropCmd = `ffmpeg -i "${tempIn}" -vf "crop=${size}:${size}:${x}:${y}" -qscale:v 2 "${tempOut}"`;

      exec(cropCmd, async (cropErr) => {
        if (cropErr) {
          console.error('❌ فشل قص الصورة:', cropErr);
          return await sock.sendMessage(msg.key.remoteJid, {
            text: '❌ حصل خطأ أثناء جعل الصورة مربعة.'
          }, { quoted: msg });
        }

        const outputBuffer = fs.readFileSync(tempOut);
        await sock.sendMessage(msg.key.remoteJid, {
          image: outputBuffer,
          caption: '✅ الصورة بقت مربعة 💠'
        }, { quoted: msg });

        fs.unlinkSync(tempIn);
        fs.unlinkSync(tempOut);
      });
    });
  }
};