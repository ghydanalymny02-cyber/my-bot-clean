// *حقوق مطور مـــجـــهـــول 🛡*
// 📄 *تجلط.js*

module.exports = {
  command: ['تجلط'],
  description: '🌘 أمر خاص بالنخبة، يرد برسالة تجلط إذا استُخدم من غيرهم',
  category: 'fun',

  async execute(sock, msg) {
    try {
      // قائمة أرقام النخبة المسموح لهم
      const eliteNumbers = [
        "967715677073@s.whatsapp.net" // رقم المطور مـــجـــهـــول
        // يمكن إضافة أرقام أخرى للنخبة هنا
      ];

      const senderNumber = msg.key.participant || msg.key.remoteJid;

      if (!eliteNumbers.includes(senderNumber)) {
        const denyText = `
انــــا بــــوت مـــجـــهـــول
مــــن  تـــجـــــرء عــــلــــى مــــنــــاداتــــي 🌘
`.trim();

        await sock.sendMessage(msg.key.remoteJid, { text: denyText }, { quoted: msg });
        return;
      }

      // إذا كان المرسل من النخبة
      const eliteText = `
🌘 أهلاً بالنخبة، أمر *تجلط* بين يديك الآن!
`.trim();

      await sock.sendMessage(msg.key.remoteJid, { text: eliteText }, { quoted: msg });
    } catch (err) {
      console.error('❌ خطأ في أمر تجلط:', err);
    }
  }
};