module.exports = {
  command: 'احزر',
  category: 'games',
  description: 'لعبة احزر الرقم من 1 إلى 10 خلال 15 ثانية!',

  async execute(sock, msg, args = []) {
    const chatId = msg.key.remoteJid;

    const sender = msg.key.participant || msg.participant || msg.key.remoteJid;

    const randomNumber = Math.floor(Math.random() * 10) + 1;

    await sock.sendMessage(chatId, {
      text: '🎯 احزر رقم من 1 إلى 10 خلال 15 ثانية، أرسل الرقم الآن!'
    }, { quoted: msg });

    let answered = false;

    const handler = async ({ messages }) => {
      const reply = messages[0];
      const replyFrom = reply.key.remoteJid;

      // نتأكد أن الرد من نفس الشخص ونفس الشات
      if (
        replyFrom === chatId &&
        !reply.key.fromMe &&
        (reply.key.participant || reply.participant || reply.key.remoteJid) === sender
      ) {
        const body = reply.message?.conversation || reply.message?.extendedTextMessage?.text;
        const guess = parseInt(body);

        if (!isNaN(guess) && guess >= 1 && guess <= 10) {
          answered = true;
          if (guess === randomNumber) {
            await sock.sendMessage(chatId, { text: `🎉 صح! الرقم هو ${randomNumber}، أحسنت!` }, { quoted: reply });
          } else {
            await sock.sendMessage(chatId, { text: `❌ خطأ! الرقم كان ${randomNumber}. حاول مرة أخرى لاحقًا.` }, { quoted: reply });
          }
          sock.ev.off('messages.upsert', handler); // إلغاء الاستماع بعد الرد
        }
      }
    };

    sock.ev.on('messages.upsert', handler);

    setTimeout(() => {
      if (!answered) {
        sock.sendMessage(chatId, {
          text: `⏱️ انتهى الوقت! الرقم الصحيح كان: ${randomNumber}`
        }, { quoted: msg });
        sock.ev.off('messages.upsert', handler); // إلغاء الاستماع بعد انتهاء الوقت
      }
    }, 15000);
  }
};