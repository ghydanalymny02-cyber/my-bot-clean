// *حقوق مطور مــجــهــول||𝕲𝕳𝕰𝕯𝕬𝕹 🛡*
// 📄 *معلومات_مطور.js*

module.exports = {
  command: ['معلومات مطور'],
  description: 'ℹ️ يعرض معلومات عن المطور بشكل أنيق مع العمر ورقم التواصل (خاص بالمطور فقط)',
  category: 'info',

  async execute(sock, msg) {
    try {
      // رقم المطور المسموح له باستخدام الأمر
      const developerNumber = "967700821174@s.whatsapp.net"; 
      const senderNumber = msg.key.participant || msg.key.remoteJid;

      if (senderNumber !== developerNumber) {
        const denyText = `
🚫 هذا الأمر مخصص للمطور فقط ولا يمكن استخدامه من غيره.
`.trim();
        await sock.sendMessage(msg.key.remoteJid, { text: denyText }, { quoted: msg });
        return;
      }

      const infoText = `
🛡 *معلومات المطور* 🛡

👤 الاسم: مــجــهــول||𝕲𝕳𝕰𝕯𝕬𝕹 ❄
💻 المجال: تطوير بوتات وأوامر إبداعية
🎨 الأسلوب: دمج التقنية مع الفن والغموض
📂 المشاريع: مكتبة أوامر ملكية + ألعاب + أوسمة + تيجان
✨ الهدف: جعل البوت تجربة أسطورية مليئة بالهيبة والفخامة
📅 العمر: قد الكوكب
📞 الرقم: +967 715 677 073

« كل كود هو لمسة فنية، وكل أمر هو لقب ملكي. »
`.trim();

      await sock.sendMessage(msg.key.remoteJid, { text: infoText }, { quoted: msg });
    } catch (err) {
      console.error('❌ خطأ في أمر معلومات مطور:', err);
    }
  }
};