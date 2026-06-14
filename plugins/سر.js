// *حقوق مطورة يوميلا 🛡*
// 📄 *سر.js*

module.exports = {
  command: ['سر'],
  description: '🤫 يكشف سر عشوائي عن شخص',
  category: 'fun',

  async execute(sock, msg) {
    try {
      const mentioned = msg.message?.extendedTextMessage?.contextInfo?.mentionedJid || [];
      const target = mentioned.length > 0 ? mentioned[0] : "شخص مجهول";

      const secrets = [
        "🤫 يملك قوة خفية لا يعرفها أحد.",
        "🤫 يخفي هيبة عظيمة بداخله.",
        "🤫 لديه ولاء لا يظهر إلا في المواقف الصعبة.",
        "🤫 يحمل سرًا يجعله مختلفًا عن الجميع.",
        "🤫 سيُزرف قريبًا في موقف غامض."
      ];
      const randomSecret = secrets[Math.floor(Math.random() * secrets.length)];

      const infoText = `
╭──〔 ❄ مـــجـــهـــول Bot 〕──╮
┃ 🤫 سر ${target}:
┃ ✨ ${randomSecret}
╰━━━━━━━━━━━━━━╯
`.trim();

      await sock.sendMessage(msg.key.remoteJid, { text: infoText, mentions: mentioned }, { quoted: msg });
    } catch (err) {
      console.error('❌ خطأ في أمر سر:', err);
    }
  }
};