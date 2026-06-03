module.exports = {
  command: 'بوسه',
  description: 'ارسل رسالة بوسة رومانسية مع منشن وصورة GIF في نفس الرسالة',
  usage: 'بوسة (رد على رسالة أو منشن لشخص أو كتابة رقمه)',
  category: 'ترفيه',

  async execute(sock, msg, args = []) {
    try {
      const chatId = msg.key.remoteJid;

      // 📌 نفس أسلوب أوامر "ادمن" في تحديد الهدف
      let targetJid = null;
      const mentioned = msg.message?.extendedTextMessage?.contextInfo?.mentionedJid;
      const contextParticipant = msg.message?.extendedTextMessage?.contextInfo?.participant;

      if (mentioned?.length) {
        targetJid = mentioned[0];
      } else if (contextParticipant) {
        targetJid = contextParticipant;
      } else if (args.length) {
        targetJid = args[0].replace(/[^0-9]/g, '') + '@s.whatsapp.net';
      }

      if (!targetJid) {
        return await sock.sendMessage(chatId, {
          text: '❗ يرجى الرد على رسالة الشخص أو منشنه أو كتابة رقمه لاستخدام هذا الأمر.'
        }, { quoted: msg });
      }

      const mentionText = `💕 أرسل لك بوسة ساخنة يا @${targetJid.split('@')[0]} 💕\n\n✨ من عمو اسكانور ✨`;

      await sock.sendMessage(chatId, {
        video: { url: 'https://files.catbox.moe/1hfchb.mp4' },
        caption: mentionText,
        gifPlayback: true,
        mentions: [targetJid]
      }, { quoted: msg });

    } catch (error) {
      console.error('خطأ في تنفيذ أمر بوسة:', error);
      await sock.sendMessage(msg.key.remoteJid, {
        text: '❌ حدث خطأ أثناء تنفيذ الأمر.'
      }, { quoted: msg });
    }
  }
};