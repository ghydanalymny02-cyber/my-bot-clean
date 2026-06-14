const { jidDecode } = require('@whiskeysockets/baileys');

module.exports = {
  command: 'صورته',
  async execute(sock, m) {
    try {
      // الحصول على الرقم الموجه له الأمر
      const mentioned = m.message?.extendedTextMessage?.contextInfo?.mentionedJid;
      const isGroup = m.key.remoteJid.endsWith('@g.us');

      // لو في جروب نجيب رقم الشخص الممنشن أو صاحب الرسالة
      // لو في الخاص نستخدم الرقم مباشرة
      const sender = isGroup ? (mentioned?.[0] || m.key.participant) : m.key.remoteJid;

      const userJid = sender || m.key.remoteJid;
      const userNum = jidDecode(userJid)?.user || userJid.split('@')[0];

      let username;
      try {
        username = await sock.getName(userJid);
      } catch {
        username = 'شخص';
      }

      let ppUrl;
      try {
        ppUrl = await sock.profilePictureUrl(userJid, 'image');
      } catch {
        ppUrl = 'https://telegra.ph/file/c0f8bb917592f4684820b.jpg'; // صورة افتراضية
      }

      const caption = `
*╭─〔 ♢ ♤ ♧ ♡ ♢ ♤ ♧ ♡ 〕─╮*
*│   ⛩️ 𝑷𝒓𝒐𝒇𝒊𝒍𝒆 𝑷𝒊𝒄 𝑷𝒂𝒕𝒉 ⛩️   │*
*│═══════════════│*
*│✧ أهلاً بك يا 「 @${userNum} 」*
*│✧ هذه هي صورتك*
*│═══════════════│*
*╰─〔 ♢ ♤ ♧ ♡ ♢ ♤ ♧ ♡ 〕─╯*
`.trim();

      await sock.sendMessage(m.key.remoteJid, {
        image: { url: ppUrl },
        caption,
        mentions: [userJid],
        contextInfo: {
          mentionedJid: [userJid],
          forwardingScore: 2025,
          isForwarded: true,
        }
      }, { quoted: m });

    } catch (err) {
      console.error(err);
      await sock.sendMessage(m.key.remoteJid, {
        text: '*【❌ حصل خطأ وأنا بجيب الصورة🍷】*'
      }, { quoted: m });
    }
  }
}