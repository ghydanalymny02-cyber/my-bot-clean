// *حقوق مطورة يوميلا 🛡*
// 📄 *تتويج.js*

module.exports = {
  command: ['تتويج'],
  description: '👑 يعلن عضو ملك القروب ليوم واحد',
  category: 'fun',

  async execute(sock, msg) {
    try {
      const metadata = await sock.groupMetadata(msg.key.remoteJid);
      const participants = metadata.participants.map(p => p.id);
      const randomMember = participants[Math.floor(Math.random() * participants.length)];

      const infoText = `
╭──〔 ❄ 𝒀𝑼𝑴𝑰𝑳𝑨 𝑩𝒐𝒕꧂ 〕──╮
┃ 👑 اليوم ${randomMember} هو ملك القروب!
╰━━━━━━━━━━━━━━╯

✨ « تتويج… أمر يمنح لقب ملك ليوم واحد بلمسة يوميلا الفخمة. »
`.trim();

      await sock.sendMessage(msg.key.remoteJid, { text: infoText, mentions: [randomMember] }, { quoted: msg });
    } catch (err) {
      console.error('❌ خطأ في أمر تتويج:', err);
    }
  }
};