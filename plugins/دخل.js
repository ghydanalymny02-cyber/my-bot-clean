const { jidDecode } = require('@whiskeysockets/baileys');

module.exports = {
  command: 'دخل',
  async execute(sock, m) {
    try {
      const groupId = m.key.remoteJid;
      const isGroup = groupId.endsWith('@g.us');
      if (!isGroup) {
        return await sock.sendMessage(groupId, { text: '❌ *الأمر ده بيشتغل في الجروبات بس*' }, { quoted: m });
      }

      // استخراج الرقم من نص الرسالة
      const text = m.message?.conversation || m.message?.extendedTextMessage?.text || '';
      const numberMatch = text.replace(/[^0-9]/g, '');

      if (!numberMatch || numberMatch.length < 8) {
        return await sock.sendMessage(groupId, {
          text: '📥 *اكتب رقم صحيح بعد الأمر مثلاً: .دخل 201234567890*'
        }, { quoted: m });
      }

      const userJid = numberMatch + '@s.whatsapp.net';

      // جلب بيانات الجروب
      const metadata = await sock.groupMetadata(groupId);
      const botNumber = sock.user.id.split(':')[0] + '@s.whatsapp.net';
      const isBotAdmin = metadata.participants.some(p => p.id === botNumber && p.admin);

      const isUserInGroup = metadata.participants.find(p => p.id === userJid);
      const isKicked = !isUserInGroup;

      if (isBotAdmin) {
        if (!isKicked) {
          return await sock.sendMessage(groupId, {
            text: `⚠️ *@${numberMatch} موجود بالفعل في الجروب!*`,
            mentions: [userJid]
          }, { quoted: m });
        }

        try {
          await sock.groupParticipantsUpdate(groupId, [userJid], 'add');
          return await sock.sendMessage(groupId, {
            text: `✅ *تمت محاولة إدخال @${numberMatch} للجروب.*`,
            mentions: [userJid]
          }, { quoted: m });
        } catch (addErr) {
          const code = await sock.groupInviteCode(groupId);
          const link = `https://chat.whatsapp.com/${code}`;
          return await sock.sendMessage(groupId, {
            text: `❌ *ما قدرتش أضيفه، ممكن مشرف كان طرده قبل كده.*\n🔗 *رابط الجروب:* ${link}`
          }, { quoted: m });
        }

      } else {
        try {
          const code = await sock.groupInviteCode(groupId);
          const link = `https://chat.whatsapp.com/${code}`;
          await sock.sendMessage(userJid, {
            text: `📩 *تمت دعوتك للجروب*\n🔗 ${link}`
          });
          return await sock.sendMessage(groupId, {
            text: `✅ *تم إرسال رابط الدعوة لـ @${numberMatch}*`,
            mentions: [userJid]
          }, { quoted: m });
        } catch {
          return await sock.sendMessage(groupId, {
            text: `❌ *ما قدرتش أبعته، احتمال إعدادات الجروب مش مفتوحة أو الرقم غلط*`
          }, { quoted: m });
        }
      }

    } catch (err) {
      console.error("🔥 خطأ في أمر دخل:", err);
      await sock.sendMessage(m.key.remoteJid, {
        text: '*❌ حصل خطأ وأنا بحاول أدخله*'
      }, { quoted: m });
    }
  }
};