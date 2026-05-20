module.exports = {
  command: 'كم',
  description: 'يعرض عدد أعضاء الجروب وعدد المشرفين',
  category: 'group',
  usage: '.عدد',
  group: true,

  async execute(sock, msg) {
    try {
      const groupId = msg.key.remoteJid;

      // تأكد أن الرسالة داخل جروب
      if (!groupId.endsWith('@g.us')) {
        return await sock.sendMessage(groupId, {
          text: '❗ هذا الأمر فقط داخل المجموعات.',
        }, { quoted: msg });
      }

      // جلب معلومات الجروب
      const metadata = await sock.groupMetadata(groupId);
      const participants = metadata.participants;

      const total = participants.length;
      const admins = participants.filter(p => p.admin).length;

      const replyText = `
📊 *إحصائيات المجموعة: ${metadata.subject}*

👥 عدد الأعضاء: *${total}*
🛡️ عدد المشرفين: *${admins}*
`.trim();

      await sock.sendMessage(groupId, { text: replyText }, { quoted: msg });

    } catch (err) {
      console.error('❌ خطأ في أمر العدد:', err);
      await sock.sendMessage(msg.key.remoteJid, {
        text: '⚠️ حصل خطأ أثناء جلب عدد الأعضاء.',
      }, { quoted: msg });
    }
  }
};