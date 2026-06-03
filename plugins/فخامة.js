// *حقوق مطور يوميلا 🛡*
// 📄 فخامة.js

const path = require('path');
const fs = require('fs');

module.exports = {
  command: ['فخامة'],
  description: 'إظهار الهوية الأسطورية + صوت Kira',
  category: 'معلومات',

  async execute(sock, msg) {
    const jid = msg.key.remoteJid;
    const botJid = sock.user.id;

    // 🗂️ مسار الصوت داخل /storage/emulated/0/bot/sounds/
    const kiraSoundPath = path.join('/storage/emulated/0/bot/sounds/', 'Kira.mp3');

    // 🏰 الهوية الأسطورية
    const identity = `
╔══════════════════════════════════════╗
     👑✨ 𝐅𝐀𝐊𝐇𝐀𝐌𝐀 𝐊𝐈𝐑𝐀 ✨👑
╚══════════════════════════════════════╝

✨⚔️ *【 فرمان الفخامة 】* ⚔️✨

- 🌌 *الاسم*: Kira — رمز العدالة المطلقة  
- 🛡️ *الهيبة*: حضور يفرض العظمة  
- ⚔️ *الرتبة*: أسطورة لا تُقارن  
- 📅 *التوثيق*: 10 / 12 / 2025  
- 🔥 *القوة*: لا يُهزم ولا يُنسى  

📊 *معلومات النظام*:
🤖 البوت: ${botJid.split('@')[0]}
⏰ الوقت: ${new Date().toLocaleTimeString('ar-EG')}
📅 التاريخ: ${new Date().toLocaleDateString('ar-EG')}
`.trim();

    try {
      // 🎬 رسالة تمهيدية قبل العرض
      await sock.sendMessage(jid, {
        text: '👑✨ تهيّأ… سيتم عرض الفخامة ومدح Kira الآن ✨👑'
      }, { quoted: msg });

      // 🎵 إرسال الصوت مع الكابشن
      await sock.sendMessage(jid, {
        audio: fs.readFileSync(kiraSoundPath),
        mimetype: 'audio/mp4',
        fileName: 'Kira.mp3',
        caption: identity
      }, { quoted: msg });

      // ✅ تأكيد النجاح
      await sock.sendMessage(jid, {
        text: '✅ تم عرض الفخامة ومدح Kira بالصوت بنجاح'
      }, { quoted: msg });

    } catch (error) {
      console.error('💥 خطأ رئيسي في فخامة.js:', error);
      await sock.sendMessage(jid, {
        text: `❌ حدث خطأ غير متوقع أثناء العرض:\n${error.message}`
      }, { quoted: msg });
    }
  }
};