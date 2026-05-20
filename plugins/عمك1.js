// 📄 amk1.js
const path = require('path');

module.exports = {
  command: ['عمك1'],
  description: 'كلمات خاصة لعمك1 + فيديو',
  category: 'معلومات',

  async execute(sock, msg) {
    const jid = msg.key.remoteJid;
    const botJid = sock.user.id;

    // 🗂️ مسار الفيديو داخل resources
    const amkVideoPath = path.join(__dirname, '../resources/amk1_edit.mp4');

    // 👑 كلمات خاصة
    const words = `
╔══════════════════════════════════════╗
     👑🔥 𝐀𝐌𝐊𝟏 — 𝐒𝐏𝐈𝐑𝐈𝐓 𝐎𝐅 𝐏𝐎𝐖𝐄𝐑 🔥👑
╚══════════════════════════════════════╝

✨⚔️ *【 كلمات من القلب 】* ⚔️✨

- 🌌 كرستانو رونالدو ليس مجرد اسم… إنه رمز الهيبة والوقار.  
- ⚡ حضوره يغيّر الموازين، وكلماته تُسجَّل كأوامر.  
- 🛡️ قوته لا تُقارن، وعزيمته لا تنكسر.  
- 👑 من يذكره، يذكر المجد والسطوة.  

💬 "لا نقرنه بمسي لانه لا مقارنة بين اثنان هن افضل بين كرة قدم."  

📊 *معلومات النظام*:
🤖 البوت: ${botJid.split('@')[0]}
⏰ الوقت: ${new Date().toLocaleTimeString('ar-EG')}
📅 التاريخ: ${new Date().toLocaleDateString('ar-EG')}
`.trim();

    try {
      // 🎬 رسالة تمهيدية
      await sock.sendMessage(jid, {
        text: '⚔️👑 تهيّأ… سيتم عرض كلمات فديو كرستيانو الآن 👑⚔️'
      }, { quoted: msg });

      // 🎥 إرسال الفيديو مع الكابشن
      await sock.sendMessage(jid, {
        video: { url: amkVideoPath },
        caption: words
      }, { quoted: msg });

      // ✅ تأكيد النجاح
      await sock.sendMessage(jid, {
        text: '✅ تم عرض كلمات بنجاح'
      }, { quoted: msg });

    } catch (error) {
      console.error('💥 خطأ رئيسي في amk1.js:', error);
      await sock.sendMessage(jid, {
        text: `❌ حدث خطأ غير متوقع أثناء العرض:\n${error.message}`
      }, { quoted: msg });
    }
  }
};