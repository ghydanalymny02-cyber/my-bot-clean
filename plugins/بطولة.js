// *حقوق مطور مــجــهــول||𝕲𝕳𝕰𝕯𝕬𝕹 🛡*
// 📄 *بطولة.js*

module.exports = {
  command: ['بطولة'],
  description: '🏆 يعلن بطولة هيبة بين الأعضاء',
  category: 'games',

  async execute(sock, msg) {
    try {
      const metadata = await sock.groupMetadata(msg.key.remoteJid);
      const participants = metadata.participants.map(p => p.id);

      if (participants.length < 2) {
        return await sock.sendMessage(msg.key.remoteJid, { text: "❌ القروب يحتاج عضوين على الأقل لبدء البطولة." }, { quoted: msg });
      }

      const fighter1 = participants[Math.floor(Math.random() * participants.length)];
      let fighter2 = fighter1;
      while (fighter2 === fighter1) {
        fighter2 = participants[Math.floor(Math.random() * participants.length)];
      }

      const infoText = `
🏆 بطولة الهيبة بدأت!
👤 ${fighter1} VS 👤 ${fighter2}

✨ « بطولة… أمر يضيف جو من المنافسة والفخامة داخل القروب. »
`.trim();

      await sock.sendMessage(msg.key.remoteJid, { text: infoText, mentions: [fighter1, fighter2] }, { quoted: msg });
    } catch (err) {
      console.error('❌ خطأ في أمر بطولة:', err);
    }
  }
};