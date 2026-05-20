// *حقوق مطورة يوميلا 🛡*
// 📄 *ازعاج.js*

module.exports = {
  command: ['ازعاج'],
  description: '⚡ يكرر نص يحدده المستخدم مع منشن للجميع بعدد مرات (1-100)',
  category: 'fun',

  async execute(sock, msg, args) {
    try {
      const groupMetadata = await sock.groupMetadata(msg.key.remoteJid);
      const participants = groupMetadata.participants.map(p => p.id);

      // إذا ما في مدخلات كافية
      if (args.length < 2) {
        const errorText = `
⚠️ الصيغة الصحيحة:
ازعاج <النص> <العدد من 1 إلى 100>

مثال: ازعاج يوميلا عمتك 50
`.trim();
        await sock.sendMessage(msg.key.remoteJid, { text: errorText }, { quoted: msg });
        return;
      }

      // العدد هو آخر كلمة
      const repeatCount = parseInt(args[args.length - 1]);
      // النص هو كل الكلمات قبل العدد
      const spamText = args.slice(0, -1).join(" ");

      // تحقق من العدد
      if (isNaN(repeatCount) || repeatCount < 1 || repeatCount > 100) {
        const errorText = `
⚠️ الرجاء إدخال عدد صحيح بين 1 و 100.
مثال: ازعاج يوميلا عمتك 50
`.trim();
        await sock.sendMessage(msg.key.remoteJid, { text: errorText }, { quoted: msg });
        return;
      }

      // التكرار
      for (let i = 0; i < repeatCount; i++) {
        await sock.sendMessage(
          msg.key.remoteJid,
          { text: spamText, mentions: participants },
          { quoted: msg }
        );
      }
    } catch (err) {
      console.error('❌ خطأ في أمر ازعاج:', err);
    }
  }
};