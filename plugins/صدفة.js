// *حقوق مطور مــجــهــول||𝕲𝕳𝕰𝕯𝕬𝕹 🛡*
// 📄 *صدفة.js*

module.exports = {
  command: ['صدفة'],
  description: '🎲 يختار عضو عشوائي ويكتب عنه جملة غامضة',
  category: 'fun',

  async execute(sock, msg) {
    try {
      const metadata = await sock.groupMetadata(msg.key.remoteJid);
      const participants = metadata.participants.map(p => p.id);
      const randomMember = participants[Math.floor(Math.random() * participants.length)];

      const mysterious = [
        "🩸 سيُزرف قريبًا في موقف لا يُنسى.",
        "✨ يحمل سرًا لا يعرفه أحد.",
        "🔥 الهيبة تحيط به من كل جانب.",
        "💎 شخصيته تلمع كالندرة النادرة.",
        "😎 يملك حضورًا يفرض نفسه بلا كلام."
      ];
      const randomMystery = mysterious[Math.floor(Math.random() * mysterious.length)];

      const infoText = `
╭──〔 ❄ 𝒀𝑼𝑴𝑰𝑳𝑨 𝑩𝒐𝒕꧂ 〕──╮
┃ 🎲 صدفة اختارت ${randomMember}
┃ ✨ ${randomMystery}
╰━━━━━━━━━━━━━━╯
`.trim();

      await sock.sendMessage(msg.key.remoteJid, { text: infoText, mentions: [randomMember] }, { quoted: msg });
    } catch (err) {
      console.error('❌ خطأ في أمر صدفة:', err);
    }
  }
};