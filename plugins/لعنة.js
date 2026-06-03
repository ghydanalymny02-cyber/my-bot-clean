// *حقوق مطورة يوميلا 🛡*
// 📄 *لعنة.js*

module.exports = {
  command: ['لعنة'],
  description: '🩸 يعطي لعنة مضحكة أو غامضة لشخص',
  category: 'fun',

  async execute(sock, msg) {
    try {
      const mentioned = msg.message?.extendedTextMessage?.contextInfo?.mentionedJid || [];
      const target = mentioned.length > 0 ? mentioned[0] : "شخص مجهول";

      const curses = [
        "🩸 لعنة المزروفية: ستُزرف في كل قروب تدخل إليه.",
        "🩸 لعنة البرودة: ستبقى باردًا مهما حاولت.",
        "🩸 لعنة الضحك: ستضحك في أوقات غير مناسبة.",
        "🩸 لعنة الهيبة: ستفرض حضورك حتى وأنت صامت.",
        "🩸 لعنة الفخامة: كل كلمة منك ستبدو ملكية."
      ];
      const randomCurse = curses[Math.floor(Math.random() * curses.length)];

      const infoText = `
╭──〔 ❄ 𝒀𝑼𝑴𝑰𝑳𝑨 Bot 〕──╮
┃ 🩸 لعنة ${target}:
┃ ✨ ${randomCurse}
╰━━━━━━━━━━━━━━╯
`.trim();

      await sock.sendMessage(msg.key.remoteJid, { text: infoText, mentions: mentioned }, { quoted: msg });
    } catch (err) {
      console.error('❌ خطأ في أمر لعنة:', err);
    }
  }
};