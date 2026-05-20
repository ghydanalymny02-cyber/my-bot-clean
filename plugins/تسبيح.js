module.exports = {
  category: 'tools',
  command: 'تسبيح',
  description: 'أذكار التسبيح',
  async execute(sock, msg) {
    const tasbeeh = [
      "🌟 سبحان الله",
      "🌙 الحمد لله",
      "🕋 الله أكبر",
      "✨ لا إله إلا الله",
      "💫 لا حول ولا قوة إلا بالله"
    ];
    const randomTasbeeh = tasbeeh[Math.floor(Math.random() * tasbeeh.length)];
    await sock.sendMessage(msg.key.remoteJid, {
      text: `📿 *تسبيح:*\n\n${randomTasbeeh}\n\n🔢 كرره 33 مرة`
    }, { quoted: msg });
  }
};