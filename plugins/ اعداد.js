const { downloadContentFromMessage } = require('@whiskeysockets/baileys');
const fs = require('fs');

module.exports = {
  command: 'اعداد',
  description: 'عرض معلومات الجروب مثل الاسم والصورة وعدد الأعضاء والمشرفين',
  category: 'group',

  async execute(sock, msg) {
    const groupId = msg.key.remoteJid;

    // تأكد أنه في جروب
    if (!groupId.endsWith('@g.us')) {
      return sock.sendMessage(groupId, {
        text: '❌ هذا الأمر يعمل فقط في المجموعات.'
      }, { quoted: msg });
    }

    try {
      const metadata = await sock.groupMetadata(groupId);
      const groupName = metadata.subject;
      const groupOwner = metadata.owner ? metadata.owner.split('@')[0] : 'غير معروف';
      const creationDate = new Date(metadata.creation * 1000).toLocaleDateString('ar-DZ');
      const totalParticipants = metadata.participants.length;
      const totalAdmins = metadata.participants.filter(p => p.admin !== null).length;

      // تحميل صورة الجروب إن وجدت
      let profilePicture;
      try {
        profilePicture = await sock.profilePictureUrl(groupId, 'image');
      } catch {
        profilePicture = 'https://i.imgur.com/0ZbYhpZ.png'; // صورة افتراضية
      }

      const caption = `
📛 *اسم الجروب:* ${groupName}
🆔 *ID:* ${groupId}
👥 *عدد الأعضاء:* ${totalParticipants}
🛡️ *عدد المشرفين:* ${totalAdmins}
🧑‍💼 *المنشئ:* ${groupOwner}
📅 *تاريخ الإنشاء:* ${creationDate}
      `.trim();

      await sock.sendMessage(groupId, {
        image: { url: profilePicture },
        caption
      }, { quoted: msg });

    } catch (error) {
      console.error('خطأ في أمر إعداد:', error);
      await sock.sendMessage(groupId, {
        text: '❌ حدث خطأ أثناء جلب معلومات الجروب.'
      }, { quoted: msg });
    }
  }
};