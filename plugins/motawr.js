const fs = require('fs');
const { join } = require('path');

// ✅ تعريف بيانات المطور (داخل الملف فقط)
global.owner = [
  ['967715677073', 'مــجــهــول||𝕲𝕳𝕰𝕯𝕬𝕹', true],
];

module.exports = {
  command: 'المطور',
  description: 'عرض معلومات المطور مع جهة الاتصال',
  usage: '.المطور',
  category: 'info',

  async execute(sock, msg) {
    try {
      const chatId = msg.key.remoteJid;

      // بيانات المطور
      const [devId, devName] = global.owner[0];
      const devTitle = '*❄ مــجــهــول||𝕲𝕳𝕰𝕯𝕬𝕹*';
      const devCountry = 'العالم🌍';
      const devAge = 'قد العالم ';
      const devNumber = `+${devId}`;
      const waLink = `https://wa.me/${devId}`;
      const devVideoPath = join(process.cwd(), 'escanor.mp4');

      // الرسالة النصية
      const infoMessage = `
┏━━━━━━ ⬣
┃ ❄ *معلومات مـــجـــهـــول ملك الظل* ❄
┃ 
┃ ✯ الاسم: ${devTitle}
┃ ✯ اللقب: *❄ يوتا*
┃ ✯ الدولة: ${devCountry}
┃ ✯ العمر: ${devAge}
┃ ✯ الرقم: 967 715 677 073
┗━━━━━━ ⬣
📌 للتواصل عبر واتساب:
967 715 677 073
      `.trim();

      // زر واتساب داخل نفس الرسالة
      const buttons = [
        {
          index: 0,
          urlButton: {
            displayText: '📨 راسلني عبر واتساب',
            url: waLink,
          },
        }
      ];

      // إرسال الرسالة (فيديو أو نص)
      if (fs.existsSync(devVideoPath)) {
        const videoBuffer = fs.readFileSync(devVideoPath);
        await sock.sendMessage(chatId, {
          video: videoBuffer,
          caption: infoMessage,
          footer: '❄ مـــجـــهـــول ',
          buttons: buttons,
          headerType: 5
        }, { quoted: msg });
      } else {
        await sock.sendMessage(chatId, {
          text: infoMessage,
          footer: '❄ مـــجـــهـــول ',
          buttons: buttons,
          headerType: 1
        }, { quoted: msg });
      }

      // ✅ إرسال جهة الاتصال (vCard)
      const vcard = `
BEGIN:VCARD
VERSION:3.0
FN:𝓢𝓗𝓐𝓓𝓞
TEL;type=CELL;type=VOICE;waid=967715677073:+967715677073
EMAIL:croco@ashura.com
NOTE:هذا رقم شخصي، لا ترسل أوامر!
END:VCARD
      `.trim();

      await sock.sendMessage(chatId, {
        contacts: {
          displayName: '♜مــجــهــول||𝕲𝕳𝕰𝕯𝕬𝕹 ',
          contacts: [{ vcard }]
        }
      }, { quoted: msg });

    } catch (err) {
      console.error('❌ خطأ في أمر المطور:', err);
      await sock.sendMessage(msg.key.remoteJid, {
        text: `❌ حدث خطأ أثناء عرض معلومات المطور:\n${err.message || err.toString()}`,
      }, { quoted: msg });
    }
  },
};
