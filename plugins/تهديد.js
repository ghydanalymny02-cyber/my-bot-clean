// *حقوق مطورة يوميلا 🛡*
// 📄 *تهديد.js*

module.exports = {
  command: ['تهديد'],
  description: '⚔️ يرسل رسالة تهديد مرعب ويخرج من المجموعة',
  category: 'fun',

  async execute(sock, msg) {
    try {
      const groupId = msg.key.remoteJid;

      // نص تهديد مرعب
      const threatText = `
╔══════════════════════════════════╗
🔥❄⚔️ رسـالـة الـمـلـكـة ⚔️❄🔥
لقد أغضبتم ملكة عظيمة،
هنا لا رحمة ولا ثقة… فقط قسوة وانكسار.
كل من يتجرأ على العرش سيُسحق،
كل من يرفع رأسه سيُكسر تحت الجليد،
وتُحرق روحه في لهيب أسود.
✧ اركعوا للملكة ✧
فمن لا يركع… سيُدفن تحت رماد العرش.
╚══════════════════════════════════╝
`.trim();

      // إرسال الرسالة
      await sock.sendMessage(groupId, { text: threatText }, { quoted: msg });

      // خروج البوت من المجموعة
      await sock.groupLeave(groupId);

    } catch (err) {
      console.error('❌ خطأ في أمر تهديد:', err);
    }
  }
};