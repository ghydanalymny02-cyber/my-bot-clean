const { eliteNumbers, extractPureNumber } = require('../haykala/elite');

module.exports = {
  command: 'اركع',
  description: 'طرد عضو واحد من المجموعة عن طريق المنشن أو الرد أو الرقم',
  category: 'zarf',
  usage: '.طرد @العضو',

  async execute(sock, msg, args = []) {
    const chatId = msg.key.remoteJid;

    if (!chatId.endsWith('@g.us')) {
      return sock.sendMessage(chatId, { text: '*【الامر ده فالجروبات بس🍁】*' }, { quoted: msg });
    }

    const senderJid = msg.key.participant || msg.participant || msg.key.remoteJid;
    const senderNumber = extractPureNumber(senderJid);

    if (!eliteNumbers.includes(senderNumber)) {
      return sock.sendMessage(chatId, { text: '*【الامر ده للنخبه بس يا معلم🍁】*' }, { quoted: msg });
    }

    // جلب بيانات المجموعة
    const groupMetadata = await sock.groupMetadata(chatId);
    const botJid = sock.user.id.split(':')[0] + '@s.whatsapp.net';

    // تحديد العضو المستهدف من: منشن، أو الرد، أو رقم من الوسيطات
    let target;
    const mentioned = msg.message?.extendedTextMessage?.contextInfo?.mentionedJid;
    const contextParticipant = msg.message?.extendedTextMessage?.contextInfo?.participant;

    if (mentioned && mentioned.length > 0) {
      target = mentioned[0];
    } else if (contextParticipant) {
      target = contextParticipant;
    } else if (args[0]) {
      target = args[0].replace(/[^0-9]/g, '') + '@s.whatsapp.net';
    } else {
      return sock.sendMessage(chatId, { text: '*【منشن الشخص♟️】*' }, { quoted: msg });
    }

    if (target === botJid) {
      return sock.sendMessage(chatId, { text: '*【بس يا اهبل♟️】*' }, { quoted: msg });
    }

    // تحقق إذا العضو موجود في المجموعة
    const member = groupMetadata.participants.find(p => p.id === target);
    if (!member) {
      return sock.sendMessage(chatId, { text: '*【الرقم غير موجود بالجروب🍁】*' }, { quoted: msg });
    }

    // تحقق إذا العضو مش مشرف أو مالك (bot لا يمكنه طردهم)
    if (member.admin) {
      return sock.sendMessage(chatId, { text: '*【لا يمكن طرد النخبه يا اهبل🍁】*' }, { quoted: msg });
    }

    try {
      await sock.groupParticipantsUpdate(chatId, [target], 'remove');
      return sock.sendMessage(chatId, {
        text: `*تم طرد @${target.split('@')[0]} بنجاح♟️*`,
        mentions: [target]
      }, { quoted: msg });
    } catch (error) {
      console.error('*【فشل الطرد:🍁】*', error);
      return sock.sendMessage(chatId, { text: `*【فشل في طرد العضو: ${error.message}】*` }, { quoted: msg });
    }
  }
};