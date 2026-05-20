module.exports = {
  command: ['اخويا'],
  description: 'إعلان اخويا وصداقة',
  category: 'ترفيه',
  usage: '.اخويا @العضو',
  group: true,

  async execute(sock, msg) {
    const mention = msg.message?.extendedTextMessage?.contextInfo?.mentionedJid?.[0];

    if (!mention) {
      return sock.sendMessage(msg.key.remoteJid, {
        text: '❌ منشن الشخص اللي عايز تقول عليه اخويا.',
      }, { quoted: msg });
    }

    const senderJid = msg.key?.participant || msg.key?.remoteJid || msg.participant || msg.sender;
    if (!senderJid) {
      return sock.sendMessage(msg.key.remoteJid, {
        text: '⚠️ لم يتم التعرف على المرسل.',
      }, { quoted: msg });
    }

    const sender = senderJid.split('@')[0];
    const target = mention.split('@')[0];

    const text = `
🤝 اخويا @${sender} و @${target}
❤️ وصاحبي وزماله اللي ما فيش حاجه تفرقنا
`;

    await sock.sendMessage(msg.key.remoteJid, {
      text,
      mentions: [mention, senderJid]
    }, { quoted: msg });
  }
};