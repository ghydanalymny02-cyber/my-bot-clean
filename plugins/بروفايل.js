const { jidDecode } = require('@whiskeysockets/baileys');

const decorate = (text) => `╭──⪧\n🍷 *${text}*\n╰──⪦`;

module.exports = {
  command: 'بروفايل',
  category: 'tools',
  description:'عرض صوره الملف الشخصي لاي شخص🖼️',
  async execute(sock, m) {
    try {
      const reply = m.message?.extendedTextMessage?.contextInfo;
      const targetJid = reply?.participant || m.key.participant;

      if (!reply || !targetJid) {
        return await sock.sendMessage(m.key.remoteJid, {
          text: decorate('👤 من فضلك *رد على رسالة الشخص* اللي عاوز تشوف بروفايله.'),
        }, { quoted: m });
      }

      const ppUrl = await sock.profilePictureUrl(targetJid, 'image').catch(() => null);

      if (!ppUrl) {
        return await sock.sendMessage(m.key.remoteJid, {
          text: decorate('❌ لا يوجد صورة بروفايل لهذا الشخص أو غير مسموح بالوصول إليها.'),
        }, { quoted: m });
      }

      await sock.sendMessage(m.key.remoteJid, {
        image: { url: ppUrl },
        caption: `📸 *صورة بروفايل* لـ @${jidDecode(targetJid)?.user || targetJid.split('@')[0]}`,
        mentions: [targetJid],
      }, { quoted: m });

    } catch (err) {
      console.error(err);
      await sock.sendMessage(m.key.remoteJid, {
        text: decorate('⚠️ حصل خطأ أثناء محاولة جلب صورة البروفايل.'),
      }, { quoted: m });
    }
  }
};