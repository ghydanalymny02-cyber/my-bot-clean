module.exports = {
  command: 'مكتئبين',
  description: 'يعرض قائمة الأعضاء الذين لا يملكون صورة ملف شخصي',
  category: 'group',
  usage: '.مكتئبين',
  group: true,

  async execute(sock, msg) {
    try {
      const groupId = msg.key.remoteJid;

      if (!groupId.endsWith('@g.us')) {
        return await sock.sendMessage(groupId, {
          text: '❗ هذا الأمر يعمل فقط داخل الجروبات.',
        }, { quoted: msg });
      }

      const metadata = await sock.groupMetadata(groupId);
      const members = metadata.participants;

      const noPfpList = [];

      for (const member of members) {
        try {
          await sock.profilePictureUrl(member.id, 'image'); // نحاول جلب الصورة
        } catch {
          noPfpList.push(member.id);
        }
      }

      if (noPfpList.length === 0) {
        return await sock.sendMessage(groupId, {
          text: '✅ جميع الأعضاء لديهم صورة ملف شخصي.',
        }, { quoted: msg });
      }

      let text = `🕵️‍♂️ الأعضاء بدون صورة:\n\n`;
      for (let jid of noPfpList) {
        text += `🔸 @${jid.split('@')[0]}\n`;
      }

      await sock.sendMessage(groupId, {
        text,
        mentions: noPfpList
      }, { quoted: msg });

    } catch (err) {
      console.error('❌ خطأ في أمر بدون_صورة:', err);
      await sock.sendMessage(msg.key.remoteJid, {
        text: '⚠️ حدث خطأ أثناء الفحص.',
      }, { quoted: msg });
    }
  }
};