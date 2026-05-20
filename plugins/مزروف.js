// *حقوق مطورة يوميلا 🛡*
// 📄 *مزروف.js*

module.exports = {
  command: ['مزروف'],
  description: '🩸 يختار عضو عشوائي ويعلنه مزروف اليوم',
  category: 'fun',

  async execute(sock, msg) {
    try {
      const metadata = await sock.groupMetadata(msg.key.remoteJid);
      const participants = metadata.participants.map(p => p.id);
      const randomMember = participants[Math.floor(Math.random() * participants.length)];

      const infoText = `
╭──〔 ❄ 𝒀𝑼𝑴𝑰𝑳𝑨 𝑩𝒐𝒕꧂ 〕──╮
┃ 🩸 مزروف اليوم هو:
┃ 👤 ${randomMember}
╰━━━━━━━━━━━━━━╯

✨ « مزروف… أمر يضيف جو من المرح والهيبة داخل القروب. »
`.trim();

      await sock.sendMessage(msg.key.remoteJid, { text: infoText, mentions: [randomMember] }, { quoted: msg });
    } catch (err) {
      console.error('❌ خطأ في أمر مزروف:', err);
    }
  }
};