// *حقوق مطور يوميلا 🛡*
// 📄 اسطوري.js

const path = require('path');
const fs = require('fs');

module.exports = {
  command: ['اسطوري'],
  description: 'إظهار الهوية الأسطورية + فيديو وصوت Kira',
  category: 'معلومات',

  async execute(sock, msg) {
    const jid = msg.key.remoteJid;
    const botJid = sock.user.id;

    // 🗂️ مسار الفيديو داخل resources
    const shadowEditPath = path.join(__dirname, '../resources/shadow_cardin_edit.mp4');

    // 🗂️ مسار الصوت داخل /storage/emulated/0/bot/sounds/
    const kiraSoundPath = path.join('/storage/emulated/0/bot/sounds/', 'Kira.mp3');

    // 🏰 الهوية الأسطورية
    const identity = `
╔══════════════════════════════════════╗
     ⚔️🌌 𝐋𝐄𝐆𝐄𝐍𝐃𝐀𝐑𝐘 𝐑𝐄𝐈𝐆𝐍 🌌⚔️
╚══════════════════════════════════════╝

✨⚔️ *【 فرمان الأساطير 】* ⚔️✨

- 🌌 *العشيرة*: سلالة LEGENDARY  
- 🦇 *ملك الأساطير*: SHADOW CARDIN — سيد العرش المظلم  
- ⚔️ *رتبة النظام*: الإصدار الأسطوري v9 — *ختم الظلال*  
- 📅 *التوثيق الأسطوري*: 30 / 11 / 2025  
- 🛡️ *درع الأمان*: Legendary-Core IX

☠️ ليس كل من حمل سيفًا أسطورة…  
فالأسطورة تُمنح للمختارين فقط.  
🌌⚔️ العرش الأسطوري لا يرحم ⚔️🌌

📊 *معلومات النظام*:
🤖 البوت: ${botJid.split('@')[0]}
⏰ الوقت: ${new Date().toLocaleTimeString('ar-EG')}
📅 التاريخ: ${new Date().toLocaleDateString('ar-EG')}
`.trim();

    try {
      // 🎬 رسالة تمهيدية قبل العرض
      await sock.sendMessage(jid, {
        text: '⚔️🌌 تهيّأ… سيتم عرض الهوية الأسطورية الآن 🌌⚔️'
      }, { quoted: msg });

      // 🎥 إرسال الفيديو مع الكابشن
      await sock.sendMessage(jid, {
        video: { url: shadowEditPath },
        caption: identity
      }, { quoted: msg });

      // 🎵 إرسال الصوت Kira.mp3 مع نفس الهوية
      await sock.sendMessage(jid, {
        audio: fs.readFileSync(kiraSoundPath),
        mimetype: 'audio/mp4',
        fileName: 'Kira.mp3',
        caption: identity
      }, { quoted: msg });

    } catch (error) {
      console.error('💥 خطأ رئيسي في اسطوري.js:', error);
      await sock.sendMessage(jid, {
        text: `❌ حدث خطأ غير متوقع أثناء العرض:\n${error.message}`
      }, { quoted: msg });
    }
  }
};