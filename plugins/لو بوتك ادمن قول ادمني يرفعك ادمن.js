const { isElite } = require('../haykala/elite');

module.exports = {
  command: 'ادمني',
  description: 'ترقية العضو أو المطورين إلى مشرف (للمجموعات فقط)',
  group: true,
  botAdmin: true,

  async execute(sock, m, args = []) {
    const isAdmin = m.isGroup && m.isAdmin;
    const text = (args && args.length > 0) ? args.join(' ').trim() : '';
    const senderJid = m.key.participant || m.key.remoteJid;
    const senderNumber = senderJid.split('@')[0];
    const chatId = m.key.remoteJid;

    // ✅ تحقق إن الرقم من النخبة
    if (!isElite(senderNumber)) {
      return await sock.sendMessage(chatId, { text: '❌ هذا الأمر مخصص فقط لأعضاء النخبة.' }, { quoted: m });
    }

    const ownerList = global.owner || [];
    const developers = ownerList.filter(([id, isCreator]) => id && isCreator);
    const developerNumbers = developers.map(([id]) => id);

    if (text === 'المطورين') {
      if (developerNumbers.length === 0) {
        return await sock.sendMessage(chatId, { text: '❌ لم يتم العثور على أي مطورين.' }, { quoted: m });
      }

      try {
        for (let dev of developerNumbers) {
          const devJid = dev + '@s.whatsapp.net';
          await sock.groupParticipantsUpdate(chatId, [devJid], 'add').catch(() => {});
          await sock.groupParticipantsUpdate(chatId, [devJid], 'promote').catch(() => {});
        }

        await sock.sendMessage(chatId, { text: '✅ تم إضافة المطورين وتعيينهم مشرفين.' }, { quoted: m });
      } catch (e) {
        await sock.sendMessage(chatId, { text: '❌ حدث خطأ أثناء إضافة المطورين.' }, { quoted: m });
      }
    } else {
      if (isAdmin) {
        return await sock.sendMessage(chatId, { text: '✅ أنت مشرف بالفعل.' }, { quoted: m });
      }

      try {
        await sock.groupParticipantsUpdate(chatId, [senderJid], 'promote');
        await sock.sendMessage(chatId, { text: '✅ تم ترقيتك إلى مشرف بنجاح.' }, { quoted: m });
      } catch (err) {
        await sock.sendMessage(chatId, { text: '❌ حدث خطأ أثناء محاولة ترقيتك. تأكد أنني مشرف.' }, { quoted: m });
      }
    }
  }
};