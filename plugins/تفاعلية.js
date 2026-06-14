// *حقوق مطورة يوميلا 🛡*
// 📄 *تفاعلية.js*

module.exports = {
  command: ['تفاعلية'],
  description: '🎭 يرسل تفاعل عشوائي ممتع',
  category: 'fun',

  async execute(sock, msg) {
    try {
      // قائمة تفاعلات عشوائية
      const reactions = [
        "🔥 تفاعل أسطوري!",
        "💖 ولاء مطلق!",
        "😂 ضحكة من القلب!",
        "😎 هيبة مطلقة!",
        "🥶 برودة يوميلا!",
        "🎉 فرحة لا توصف!",
        "🩸 قوة تتجلى!"
      ];

      // اختيار تفاعل عشوائي
      const randomReaction = reactions[Math.floor(Math.random() * reactions.length)];

      const infoText = `
╭──〔 ❄ مـــجـــهـــول 𝑩𝒐𝒕꧂ 〕──╮
┃ 🎭 تفاعل جديد:
┃ ${randomReaction}
╰━━━━━━━━━━━━━━╯

✨ « تفاعلية… أمر يضيف المرح والردود العشوائية بلمسة يوميلا الفخمة. »
`.trim();

      await sock.sendMessage(msg.key.remoteJid, { text: infoText }, { quoted: msg });

    } catch (err) {
      console.error('❌ خطأ في أمر تفاعلية:', err);
      await sock.sendMessage(msg.key.remoteJid, {
        text: '❌ حصل خطأ أثناء تنفيذ أمر تفاعلية.'
      }, { quoted: msg });
    }
  }
};