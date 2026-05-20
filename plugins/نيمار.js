// 📄 neymar.js
const path = require('path');

module.exports = {
  command: ['نيمار'],
  description: 'مدح نيمار + فيديو خاص',
  category: 'معلومات',

  async execute(sock, msg) {
    const jid = msg.key.remoteJid;
    const botJid = sock.user.id;

    // 🗂️ مسار الفيديو داخل resources
    const neymarVideoPath = path.join(__dirname, '../resources/neymar_edit.mp4');

    // 👑 رسالة المدح المزخرفة
    const praise = `
╔══════════════════════════════════════╗
      👑⚡ 𝐍𝐄𝐘𝐌𝐀𝐑 𝐉𝐑 — 𝐓𝐇𝐄 𝐌𝐀𝐆𝐈𝐂 ⚡👑
╚══════════════════════════════════════╝

🔥✨ *【 مدح الأسطورة 】* ✨🔥

⚽🌌 هذا نيمار…  
ساحر الكرة، سيد المراوغات، وصاحب اللمسة التي تُذهل الجماهير.  

👑 حضوره يفرض المتعة،  
⚡ لمساته تُشعل المدرجات،  
🛡️ موهبته لا تُقارن،  
🌌 أثره خالد في ذاكرة الملاعب.  

💬 "ليس كل لاعب يُسمى فنانًا…  
لكن نيمار هو الفن الذي يمشي على أرض الملعب."  

📊 *معلومات النظام*:
🤖 البوت: ${botJid.split('@')[0]}
⏰ الوقت: ${new Date().toLocaleTimeString('ar-EG')}
📅 التاريخ: ${new Date().toLocaleDateString('ar-EG')}
`.trim();

    try {
      // 🎬 رسالة تمهيدية
      await sock.sendMessage(jid, {
        text: '⚡👑 تهيّأ… سيتم عرض مدح نيمار الآن 👑⚡'
      }, { quoted: msg });

      // 🎥 إرسال الفيديو مع الكابشن
      await sock.sendMessage(jid, {
        video: { url: neymarVideoPath },
        caption: praise
      }, { quoted: msg });

      // ✅ تأكيد النجاح
      await sock.sendMessage(jid, {
        text: '✅ تم عرض مدح نيمار بنجاح'
      }, { quoted: msg });

    } catch (error) {
      console.error('💥 خطأ رئيسي في neymar.js:', error);
      await sock.sendMessage(jid, {
        text: `❌ حدث خطأ غير متوقع أثناء العرض:\n${error.message}`
      }, { quoted: msg });
    }
  }
};