const { isElite } = require('../haykala/elite');

module.exports = {
  command: ['قول'],
  description: 'امنشن أو اعمل ريبلاي لشخص وخليه يقول الكلمة اللي تحددها قبل الطرد.',
  category: 'DEVELOPER',

  async execute(sock, msg) {
    const groupJid = msg.key.remoteJid;
    const senderJid = msg.key.participant || msg.participant || msg.key.remoteJid;

    if (!groupJid.endsWith('@g.us')) {
      return sock.sendMessage(groupJid, { text: '❌ هذا الأمر يعمل فقط داخل المجموعات.' }, { quoted: msg });
    }

    const senderNumber = senderJid.split('@')[0];
    if (!isElite(senderNumber)) {
      return sock.sendMessage(groupJid, { text: '❌ هذا الأمر مخصص للنخبة فقط.' }, { quoted: msg });
    }

    const mentioned = msg.message?.extendedTextMessage?.contextInfo?.mentionedJid || [];
    const quoted = msg.message?.extendedTextMessage?.contextInfo?.participant;
    const target = mentioned[0] || quoted;

    if (!target) {
      return sock.sendMessage(groupJid, { text: '⚠️ لازم تمنشن أو ترد على الشخص اللي عايزه يقول الكلمة.' }, { quoted: msg });
    }

    // استخراج النص بعد الأمر (زي أمر خاصك)
    let requiredWord = '';
    if (msg.message?.extendedTextMessage?.text) {
      let textWithoutCommand = msg.message.extendedTextMessage.text.replace(/^\S+\s*/, '');
      // إزالة المنشنات من النص
      mentioned.forEach(jid => {
        const mentionText = `@${jid.split('@')[0]}`;
        textWithoutCommand = textWithoutCommand.replace(mentionText, '');
      });
      requiredWord = textWithoutCommand.trim();
    }

    if (!requiredWord) {
      return sock.sendMessage(groupJid, { text: '⚠️ لازم تكتب الكلمة بعد الأمر.\n\nمثال:\n.قول هلا' }, { quoted: msg });
    }

    const targetNumber = target.split('@')[0];
    const developerNumber = '201116880068@s.whatsapp.net';
    if (target === developerNumber) {
      return sock.sendMessage(groupJid, {
        text: '*❌ تحاول تطرد المطور؟ مستحيل يا شخة 🫦*',
        mentions: [developerNumber],
      }, { quoted: msg });
    }

    let countdown = 30;
    let hasSaidWord = false;

    const countdownMsg = await sock.sendMessage(groupJid, {
      text: ` @${targetNumber} قول "${requiredWord}" قبل ${countdown} ثانية وإلا سيتم طردك!`,
      mentions: [target],
    });

    const messageListener = async (newMsg) => {
      try {
        const message = newMsg.messages[0];
        if (!message || !message.message) return;

        const from = message.key.remoteJid;
        const sender = message.key.participant || message.key.remoteJid;

        if (from === groupJid && sender === target) {
          const body =
            message.message?.conversation ||
            message.message?.extendedTextMessage?.text ||
            '';

          if (body.trim().includes(requiredWord)) {
            hasSaidWord = true;

            await sock.sendMessage(groupJid, {
  text: `👌 @${targetNumber} طاع المطور وقال "${requiredWord}" فتم العفو عنه ✨.`,
  mentions: [target],
});

            sock.ev.off('messages.upsert', messageListener);
          }
        }
      } catch (err) {
        console.error('خطأ أثناء المراقبة:', err);
      }
    };

    sock.ev.on('messages.upsert', messageListener);

    const interval = setInterval(async () => {
      if (hasSaidWord) {
        clearInterval(interval);
        return;
      }

      countdown--;

      if (countdown > 0) {
        try {
          await sock.sendMessage(groupJid, {
            edit: countdownMsg.key,
            text: ` @${targetNumber} قول "${requiredWord}" قبل ${countdown} ثانية أو يتم طردك يا عبدي 🫦🤙.`,
            mentions: [target],
          });
        } catch (err) {
          console.log('فشل تعديل العد التنازلي:', err);
        }
      } else {
        clearInterval(interval);
        sock.ev.off('messages.upsert', messageListener);

        if (!hasSaidWord) {
          try {
            await sock.groupParticipantsUpdate(groupJid, [target], 'remove');
            await sock.sendMessage(groupJid, {
              text: `🚫 تم طرد @${targetNumber} لأنه رفض أمر ملكه بأن يقول "${requiredWord}" 🫦.`,
              mentions: [target],
            });
          } catch (err) {
            await sock.sendMessage(groupJid, { text: '❌ لم أتمكن من تنفيذ عملية الطرد. تأكد أنني مشرف.' });
          }
        }
      }
    }, 1000);
  },
};