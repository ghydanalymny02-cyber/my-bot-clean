const { isElite, extractPureNumber } = require('../haykala/elite');

module.exports = {
  command: 'فشخ',
  description: 'يرسل رسالة فشخ مع منشن لكل الجروب',
  category: 'النخبة',

  async execute(sock, msg, args = []) {
    try {
      const senderJid = msg.key.participant || msg.participant || msg.key.remoteJid;
      const senderNumber = extractPureNumber(senderJid);
      const groupJid = msg.key.remoteJid;

      // تحقق ان الأمر فقط في الجروبات
      if (!groupJid.endsWith('@g.us')) {
        return sock.sendMessage(groupJid, { text: '❌ هذا الأمر يعمل فقط في القروبات.' }, { quoted: msg });
      }

      // تحقق صلاحيات النخبة
      if (!isElite(senderNumber)) {
        return sock.sendMessage(groupJid, { text: '*ما معك صلاحية دز*' }, { quoted: msg });
      }

      // جلب بيانات الجروب
      const metadata = await sock.groupMetadata(groupJid).catch(() => null);
      if (!metadata) return;

      // أخذ معرفات الأعضاء
      const mentions = metadata.participants.map(p => p.id);

      const replyText = `╭─❍ 『 * عمكم مــجــهــول||𝕲𝕳𝕰𝕯𝕬𝕹* 』 ❍\n\n│ 👣 بختصار تم الدعس على وجهك وفشخك من قبل عمك مــجــهــول||𝕲𝕳𝕰𝕯𝕬𝕹 روح تعالج🥱🥱 وروح نام ياغالي🥱🥱 و...؟\n\n> *اذا عرفت انـتقـم* :\n\n★─────────────────╰`;

      // إرسال الرسالة
      await sock.sendMessage(groupJid, {
        text: replyText,
        mentions: mentions
      }, { quoted: msg });

    } catch (err) {
      console.error("خطأ في أمر الفشخ:", err);
      return sock.sendMessage(msg.key.remoteJid, {
        text: `❌ حدث خطأ أثناء تنفيذ الأمر.`
      }, { quoted: msg });
    }
  }
};
