module.exports = {
  command: 'يحبني',
  description: '💘 يكشف مين بيحبك في الجروب (عشوائي)',
  category: 'ترفيه',

  async execute(sock, msg) {
    const jid = msg.key.remoteJid;
    const metadata = await sock.groupMetadata(jid);
    const members = metadata.participants.filter(p => p.id !== msg.sender);
    const random = members[Math.floor(Math.random() * members.length)];

    const name = random?.id?.split('@')[0] || 'مش لاقي حد 😢';

    await sock.sendMessage(jid, {
      text: `💘 اللي بيحبك سرًا هو: @${name}`,
      mentions: [random.id]
    }, { quoted: msg });
  }
};