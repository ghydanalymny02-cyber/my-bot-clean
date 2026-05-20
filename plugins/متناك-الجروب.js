module.exports = {
  command: 'متناك-الجروب',
  description: '😳 يكشف مين أكتر واحد متناك في الجروب (عشوائي)',
  category: 'ترفيه',

  async execute(sock, msg) {
    const jid = msg.key.remoteJid;
    const metadata = await sock.groupMetadata(jid);
    const members = metadata.participants.filter(p => p.id !== msg.sender);

    if (members.length === 0) {
      return await sock.sendMessage(jid, {
        text: '👀 مفيش أعضاء أختار منهم يا نجم...',
      }, { quoted: msg });
    }

    const random = members[Math.floor(Math.random() * members.length)];
    const name = random?.id?.split('@')[0] || 'حد مش معروف';

    await sock.sendMessage(jid, {
      text: `🫩 أكتر واحد متناك في الجروب هو: @${name} 💀`,
      mentions: [random.id]
    }, { quoted: msg });
  }
};