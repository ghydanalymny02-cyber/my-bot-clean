const { downloadContentFromMessage } = require('@whiskeysockets/baileys');
const fs = require('fs');
const { exec } = require('child_process');
const path = require('path');

module.exports = {
  command: 'قص',
  description: 'يقص أطراف الصورة بنسبة محددة مثل: .قص 10×10',
  category: 'image',

  async execute(sock, msg) {
    const quoted = msg.message?.extendedTextMessage?.contextInfo?.quotedMessage;
    const imageMessage = quoted?.imageMessage;

    if (!imageMessage) {
      return await sock.sendMessage(msg.key.remoteJid, {
        text: '❗ الرد على صورة مع كتابة النسبة مثال: .قص 5×5'
      }, { quoted: msg });
    }

    const body = msg.message?.conversation || msg.message?.extendedTextMessage?.text || '';
    const args = body.trim().split(' ').slice(1).join(' ');
    const match = args.match(/(\d+)[×x](\d+)/);

    if (!match) {
      return await sock.sendMessage(msg.key.remoteJid, {
        text: '❗ الصيغة لازم تكون مثل: .قص 5×5'
      }, { quoted: msg });
    }

    const xPercent = parseInt(match[1]);
    const yPercent = parseInt(match[2]);

    const stream = await downloadContentFromMessage(imageMessage, 'image');
    const buffer = [];
    for await (const chunk of stream) buffer.push(chunk);
    const imageBuffer = Buffer.concat(buffer);

    const tempIn = path.join(__dirname, '../temp/input.jpg');
    const tempOut = path.join(__dirname, '../temp/output.jpg');
    fs.writeFileSync(tempIn, imageBuffer);

    const command = `ffmpeg -i "${tempIn}" -vf "crop=iw*(1-${xPercent}/50):ih*(1-${yPercent}/50)" -qscale:v 2 "${tempOut}"`;

    exec(command, async (err) => {
      if (err) {
        console.error('❌ فشل قص الصورة:', err);
        return await sock.sendMessage(msg.key.remoteJid, {
          text: '❌ حصل خطأ أثناء قص الصورة.'
        }, { quoted: msg });
      }

      const outputBuffer = fs.readFileSync(tempOut);
      await sock.sendMessage(msg.key.remoteJid, {
        image: outputBuffer,
        caption: `📐 تم قص الصورة بنسبة ${xPercent}% من العرض و${yPercent}% من الطول.`
      }, { quoted: msg });

      fs.unlinkSync(tempIn);
      fs.unlinkSync(tempOut);
    });
  }
};