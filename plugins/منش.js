module.exports = {
  command: 'مشكله',
  description: 'منشن لكل المشرفين الجروب مع رسالة لوفي ',
  category: 'تحكم',
  hidden: false,

  async execute(sock, msg) {
    try {
      if (!msg.key.remoteJid.endsWith('@g.us')) {
        return await sock.sendMessage(msg.key.remoteJid, { text: '❌ هذا الأمر يعمل فقط في المجموعات.' });
      }

      const groupMetadata = await sock.groupMetadata(msg.key.remoteJid);
      const participants = groupMetadata.participants;

      let text = '';
      text += '🩸👑━━━━━━━━━━━👑🩸\n\n';
      text += '『 ⚜️ تعالو كلكم  』\n';
      text += '✨ حصلت مشكله منقدر نحلها ✨\n';
      text += '🔥 الرجاء من كل الأعضاء القدوم 🔥\n\n';
      text += '🩸👑━━━━━━━━━━━👑🩸\n\n';

      // منشن كل عضو بسطر مستقل
      for (const user of participants) {
        const userId = user.id.split('@')[0];
        text += `⚡ @${userId}\n\n`;
      }

      text += '🩸👑━━━━━━━━━━━👑🩸\n';
      text += '『 💀 بسرعا تعالو قبل ما تتفاقم المشكله 💀 』\n';
      text += '🩸👑━━━━━━━━━━━👑🩸';

      const mentions = participants.map(user => user.id);

      await sock.sendMessage(msg.key.remoteJid, {
        text,
        mentions
      });

    } catch (error) {
      console.error('❌ خطأ في أمر منشن:', error);
    }
  }
};