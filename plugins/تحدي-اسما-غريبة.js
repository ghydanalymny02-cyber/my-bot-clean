// *حقوق مطورة يوميلا 🛡*
// 📄 *تحدي_أسماء_غريبة.js*

module.exports = {
  command: ['تحدي أسماء غريبة'],
  description: '🌀 يعطي اسم غريب ويطلب قصة قصيرة عنه',
  category: 'games',

  async execute(sock, msg) {
    try {
      const names = ["مزروفان", "هيبوز", "فخامون", "ندريكس"];
      const randomName = names[Math.floor(Math.random() * names.length)];

      const infoText = `
🌀 تحدي الأسماء الغريبة بدأ!
اكتبوا قصة قصيرة عن: ${randomName}
`.trim();

      await sock.sendMessage(msg.key.remoteJid, { text: infoText }, { quoted: msg });
    } catch (err) {
      console.error('❌ خطأ في أمر تحدي أسماء غريبة:', err);
    }
  }
};