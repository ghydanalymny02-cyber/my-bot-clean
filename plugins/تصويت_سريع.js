// *حقوق مطور مــجــهــول||𝕲𝕳𝕰𝕯𝕬𝕹 🛡*
// 📄 *تصويت_سريع.js*

module.exports = {
  command: ['تصويت سريع'],
  description: '📊 يفتح تصويت عشوائي سريع داخل القروب',
  category: 'games',

  async execute(sock, msg) {
    try {
      const polls = [
        "📊 شاي ☕ أم قهوة 🍵؟",
        "📊 أنمي ⛩️ أم أفلام 🎬؟",
        "📊 هيبة 😎 أم فخامة 💎؟"
      ];
      const randomPoll = polls[Math.floor(Math.random() * polls.length)];

      const infoText = `
🎮 تصويت سريع بدأ الآن:
${randomPoll}

✨ « تصويت سريع… أمر يضيف جو من التفاعل والمرح داخل القروب. »
`.trim();

      await sock.sendMessage(msg.key.remoteJid, { text: infoText }, { quoted: msg });
    } catch (err) {
      console.error('❌ خطأ في أمر تصويت سريع:', err);
    }
  }
};