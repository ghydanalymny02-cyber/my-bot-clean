// *حقوق مطور مــجــهــول||𝕲𝕳𝕰𝕯𝕬𝕹 ⚡*
// 📄 سيي.js

module.exports = {
  command: ['سيي'],
  description: 'وصف لرونالدو مع منشن مخفي للجميع',
  category: 'ترفيه',

  async execute(sock, msg, args) {
    try {
      const jid = msg.key.remoteJid;

      // جلب معلومات المجموعة
      const metadata = await sock.groupMetadata(jid);
      const participants = metadata.participants;

      // استخراج أرقام الأعضاء
      const mentions = participants.map(p => p.id);

      // إرسال الرسالة مع المنشن المخفي
      await sock.sendMessage(jid, {
        text: '📌 *Cristiano Ronaldo is here* ⚡',
        mentions: mentions
      }, { quoted: msg });

    } catch (err) {
      console.error("❌ خطأ في سيي.js:", err);
    }
  }
};