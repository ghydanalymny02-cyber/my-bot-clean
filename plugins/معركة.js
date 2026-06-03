// *حقوق مطورة يوميلا 🛡*
// 📄 *معركة.js*

module.exports = {
  command: ['معركة'],
  description: '⚔️ يختار عضوين عشوائيًا ويعلن معركة هيبة بينهم',
  category: 'fun',

  async execute(sock, msg) {
    try {
      const metadata = await sock.groupMetadata(msg.key.remoteJid);
      const participants = metadata.participants.map(p => p.id);

      if (participants.length < 2) {
        return await sock.sendMessage(msg.key.remoteJid, { text: "❌ القروب يحتاج عضوين على الأقل لبدء المعركة." }, { quoted: msg });
      }

      const fighter1 = participants[Math.floor(Math.random() * participants.length)];
      let fighter2 = fighter1;
      while (fighter2 === fighter1) {
        fighter2 = participants[Math.floor(Math.random() * participants.length)];
      }

      const infoText = `
╭──〔 ❄ 𝒀𝑼𝑴𝑰𝑳𝑨 𝑩𝒐𝒕꧂ 〕──╮
┃ ⚔️ معركة الهيبة بدأت!
┃ 👤 ${fighter1} VS 👤 ${fighter2}
╰━━━━━━━━━━━━━━╯

✨ « معركة… أمر يضيف جو من التحدي والمرح داخل القروب. »
`.trim();

      await sock.sendMessage(msg.key.remoteJid, { text: infoText, mentions: [fighter1, fighter2] }, { quoted: msg });
    } catch (err) {
      console.error('❌ خطأ في أمر معركة:', err);
    }
  }
};