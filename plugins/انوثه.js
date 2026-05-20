module.exports = {
  command: 'انوثه',
  description: '💃 نسبة الأنوثة لك أو لصديقك',
  usage: '.انوثه [منشن]',
  category: 'ترفيه',

  async execute(sock, msg) {
    let targetJid;

    if (
      msg.message?.extendedTextMessage?.contextInfo?.mentionedJid &&
      msg.message.extendedTextMessage.contextInfo.mentionedJid.length > 0
    ) {
      // في منشن
      targetJid = msg.message.extendedTextMessage.contextInfo.mentionedJid[0];
    } else {
      // مفيش منشن، استخدم اللي بعت
      targetJid = msg.key.participant || msg.key.remoteJid;
    }

    const percentage = Math.floor(Math.random() * 101);
    const targetId = targetJid.split('@')[0];

    await sock.sendMessage(msg.key.remoteJid, {
      text: `💃 نسبة الأنوثة لـ *@${targetId}*: *${percentage}%*\n\n✨ الدلع ولا مش أي دلع؟`,
      mentions: [targetJid]
    }, { quoted: msg });
  }
};