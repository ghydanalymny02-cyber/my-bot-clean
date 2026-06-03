// *حقوق مطورة يوميلا 🛡*
// 📄 *قرعة.js*

module.exports = {
  command: ['قرعة'],
  description: '🎲 يختار عضو عشوائي من القروب',
  category: 'fun',

  async execute(sock, msg) {
    try {
      const metadata = await sock.groupMetadata(msg.key.remoteJid);
      const participants = metadata.participants.map(p => p.id);
      const randomMember = participants[Math.floor(Math.random() * participants.length)];

      const infoText = `
╭──〔 ❄ 𝒀𝑼𝑴𝑰𝑳𝑨 𝑩𝒐𝒕꧂ 〕──╮
┃ 🎲 عضو اليوم العشوائي:
┃ 👤 ${randomMember}
╰━━━━━━━━━━━━━━╯

✨ « قرعة… أمر يختار شخصًا عشوائيًا ليكون مزروف اليوم. »
`.trim();

      await sock.sendMessage(msg.key.remoteJid, { text: infoText, mentions: [randomMember] }, { quoted: msg });
    } catch (err) {
      console.error('❌ خطأ في أمر قرعة:', err);
    }
  }
};