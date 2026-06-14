const { extractPureNumber } = require('../haykala/elite');

module.exports = {
  command: ['صحيفة'],
  description: 'يرسل الصحيفة الخاصة بـ ناخت 👑',
  category: 'tools',

  async execute(sock, msg, args) {
    const jid = msg.key.remoteJid;
    const isQuoted = msg.message?.extendedTextMessage?.contextInfo?.participant;
    const quotedMsg = msg.message?.extendedTextMessage?.contextInfo?.quotedMessage;
    const mentionedJid = msg.message?.extendedTextMessage?.contextInfo?.mentionedJid || [];

    let targetMention = '';

    if (mentionedJid.length > 0) {
      targetMention = `@${extractPureNumber(mentionedJid[0])}`;
    } else if (isQuoted) {
      targetMention = `@${extractPureNumber(isQuoted)}`;
    }

    const shkhra = `رابط الصحيفة ↡
    
   https://chat.whatsapp.com/GDCRMzIfzvY6Itm4ofH75i
    
    اذا تريد ادخل. اذا ما تريد همات ادخل 🤎✨`.trim();

    await sock.sendMessage(jid, {
      text: shkhra,
      mentions: mentionedJid.length > 0 ? mentionedJid : isQuoted ? [isQuoted] : [],
    }, {
      quoted: msg,
    });
  }
};