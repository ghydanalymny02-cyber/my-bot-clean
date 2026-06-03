// *حقوق مطورة يوميلا 🛡*
// 📄 *ختم.js*

module.exports = {
  command: ['ختم'],
  description: '🩸 يرسل ختم يوميلا الفخم',
  category: 'fun',

  async execute(sock, msg) {
    try {
      const infoText = `
╔═══ ❄ 𝒀𝑼𝑴𝑰𝑳𝑨 𝑩𝒐𝒕꧂ ═══╗
🩸 ختم يوميلا الفخم
هيبة ┇ قوة ┇ فخامة
╚══════════════════╝
`.trim();

      await sock.sendMessage(msg.key.remoteJid, { text: infoText }, { quoted: msg });
    } catch (err) {
      console.error('❌ خطأ في أمر ختم:', err);
    }
  }
};