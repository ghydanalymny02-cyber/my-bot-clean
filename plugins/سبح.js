module.exports = {
  category: 'tools',
  command: 'سبح',
  description: 'عداد التسبيح',
  async execute(sock, msg) {
    await sock.sendMessage(msg.key.remoteJid, {
      text: `📿 *عداد التسبيح:*\n\n` +
            `🔢 *سبحان الله:* 33 مرة\n` +
            `🔢 *الحمد لله:* 33 مرة\n` +
            `🔢 *الله أكبر:* 33 مرة\n` +
            `🔢 *لا إله إلا الله:* مرة واحدة\n\n` +
            `🌟 المجموع: 100 تسبيحة 🕌`
    }, { quoted: msg });
  }
};