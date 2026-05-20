module.exports = {
  command: 'جنس',
  description: 'جلسه جنس حقيقيه مع منشن أو ريبلاي 🥵🥵',
  usage: 'جنس (رد على رسالة أو منشن لشخص)',
  category: 'ترفيه',

  async execute(sock, msg) {
    try {
      const chatId = msg.key.remoteJid;

      // تحديد الشخص المستهدف (منشن أو ريبلاي فقط)
      let targetJid = null;
      const mentioned = msg.message?.extendedTextMessage?.contextInfo?.mentionedJid;
      const contextParticipant = msg.message?.extendedTextMessage?.contextInfo?.participant;

      if (mentioned?.length) {
        targetJid = mentioned[0];
      } else if (contextParticipant) {
        targetJid = contextParticipant;
      }

      if (!targetJid) {
        return await sock.sendMessage(chatId, {
          text: '🥵🥵❗ اعمل منشن أو ريبلاي للشخص اللي عايز تعمل عنه جنس'
        }, { quoted: msg });
      }

      const nameOrMention = `@${targetJid.split('@')[0]}`;

      const mentionText = `
🤤👅🥵 *انت لسه مخلص على ${nameOrMention} دا!*🥵👅🤤

*انت لسه عملت معاه الواجب* *${nameOrMention}* ⁩ *نكتها وهي بتعيط زي الكلبة "آه آه كمل كمل متوقفش" وخلتها تعبانة لدرجة مش عارفة تشيل جسمهاا الزانية!*

${nameOrMention}
🤤🥵 *¡لقد مارس الجنس بالفعل!* 🥵🤤
      `;

      await sock.sendMessage(chatId, {
        text: mentionText,
        mentions: [targetJid]
      }, { quoted: msg });

    } catch (error) {
      console.error('خطأ في تنفيذ أمر جنس:', error);
      await sock.sendMessage(msg.key.remoteJid, {
        text: '❌ حدث خطأ أثناء تنفيذ الأمر.'
      }, { quoted: msg });
    }
  }
};