const fs = require("fs");
const path = require("path");

module.exports = {
  command: ['صاروخ'],
  description: '🚀 رحلة صاروخية ممتعة',
  category: 'ترفيه',
  usage: '.صاروخ',
  group: true,

  async execute(sock, msg) {
    const from = msg.key.remoteJid;
    const sender = msg.key.participant || msg.sender;
    const toM = a => '@' + a.split('@')[0];


    // أول رسالة
    await sock.sendMessage(from, {
      text: `🔍 ${toM(sender)} يبحث عن الموقع.....`,
      mentions: [sender]
    }, { quoted: msg });

    // تاني رسالة
    await sock.sendMessage(from, {
      text: `🌕
▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒
▒▒▄▄▄▒▒▒█▒▒▒▒▄▒▒▒▒▒▒▒▒
▒█▀█▀█▒█▀█▒▒█▀█▒▄███▄▒
░█▀█▀█░█▀██░█▀█░█▄█▄█░
░█▀█▀█░█▀████▀█░█▄█▄█░
████████▀█████████████
🚀
👨‍🚀 يبدأ الرحلة....`,
    }, { quoted: msg });

    // تالت رسالة
    await sock.sendMessage(from, {
      text: `🌕
🚀
▒▒▄▄▄▒▒▒█▒▒▒▒▄▒▒▒▒▒▒▒▒
▒█▀█▀█▒█▀█▒▒█▀█▒▄███▄▒
░█▀█▀█░█▀██░█▀█░█▄█▄█░
░█▀█▀█░█▀████▀█░█▄█▄█░
████████▀█████████████
➕ في الرحلة....`,
    }, { quoted: msg });

    // الرسالة الأخيرة
    await sock.sendMessage(from, {
      text: `🪐تم الهبوط بنجاح 🪐
شكرا لاستخدامك بوت 𝑬𝑺𝑪𝑨𝑵𝑶𝑹`,
      mentions: [sender]
    }, { quoted: msg });
  }
};