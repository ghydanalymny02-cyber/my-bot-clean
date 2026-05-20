// *حقوق مطورة يوميلا 🛡*
// 📄 *توافق.js*

module.exports = {
  command: ['توافق'],
  description: '💞 يعطي نسبة توافق بين شخصين',
  category: 'fun',

  async execute(sock, msg) {
    try {
      const mentioned = msg.message?.extendedTextMessage?.contextInfo?.mentionedJid || [];
      if (mentioned.length < 2) {
        return await sock.sendMessage(msg.key.remoteJid, { text: "❌ يجب منشن شخصين للحصول على نسبة التوافق." }, { quoted: msg });
      }

      const target1 = mentioned[0];
      const target2 = mentioned[1];
      const compatibility = Math.floor(Math.random() * 101);

      const infoText = `
╭──〔 ❄ 𝒀𝑼𝑴𝑰𝑳𝑨 𝑩𝒐𝒕꧂ 〕──╮
┃ 💞 نسبة توافق بين ${target1} و ${target2}
┃ 📊 ${compatibility}%
╰━━━━━━━━━━━━━━╯

✨ « توافق… أمر يكشف مدى الانسجام بين شخصين بلمسة يوميلا الفخمة. »
`.trim();

      await sock.sendMessage(msg.key.remoteJid, { text: infoText, mentions: mentioned }, { quoted: msg });
    } catch (err) {
      console.error('❌ خطأ في أمر توافق:', err);
    }
  }
};