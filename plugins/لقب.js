// *حقوق مطورة يوميلا 🛡*
// 📄 *لقب.js*

module.exports = {
  command: ['لقب'],
  description: '🏷️ يعطي لقب عشوائي لشخص',
  category: 'fun',

  async execute(sock, msg) {
    try {
      const mentioned = msg.message?.extendedTextMessage?.contextInfo?.mentionedJid || [];
      const target = mentioned.length > 0 ? mentioned[0] : "شخص مجهول";

      const titles = ["الهيبة المطلقة", "مزروف الأسطورة", "ملك البرودة", "سيد الفخامة", "الندرة النادرة"];
      const randomTitle = titles[Math.floor(Math.random() * titles.length)];

      const infoText = `
╭──〔 ❄ مـــجـــهـــول 𝑩𝒐𝒕꧂ 〕──╮
┃ 🏷️ لقب ${target}
┃ ✨ ${randomTitle}
╰━━━━━━━━━━━━━━╯

✨ « لقب… أمر يمنح هوية فخمة للأعضاء بلمسة يوميلا. »
`.trim();

      await sock.sendMessage(msg.key.remoteJid, { text: infoText, mentions: mentioned }, { quoted: msg });
    } catch (err) {
      console.error('❌ خطأ في أمر لقب:', err);
    }
  }
};