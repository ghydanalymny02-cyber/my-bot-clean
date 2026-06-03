const questions = [
  "🫣 هل سبق وأن كذبت على شخص تحبه؟",
  "😳 كم مرة تم طردك من قروب؟",
  "🤔 من أكثر شخص تكرهه؟",
  "💬 هل في شخص داخل القروب يعجبك؟",
  "👀 هل سبق وفشلت في اختبار مهم؟",
  "💔 هل ما زلت تشتاق لشخص تركك؟",
  "😅 متى آخر مرة بكيت؟",
  "🔥 لو طلبوا منك تفضح سر، وش راح تقول؟",
  "🎭 هل سبق وتكلمت عن شخص من وراه؟",
  "🫢 كم سر عندك محد يعرفه؟",
];

module.exports = {
  command: 'محرج',
  description: 'يرسل لك سؤال محرج عشوائي',
  usage: '.محرج',
  category: 'ترفيه',
  async execute(sock, msg) {
    try {
      const question = questions[Math.floor(Math.random() * questions.length)];
      await sock.sendMessage(msg.key.remoteJid, {
        text: `📢 سؤال محرج:\n\n${question}`,
        quoted: msg,
      });
    } catch (error) {
      console.error('❌ خطأ في أمر محرج:', error);
      await sock.sendMessage(msg.key.remoteJid, {
        text: `❌ حدث خطأ أثناء تنفيذ الأمر: ${error.message || error.toString()}`,
      }, { quoted: msg });
    }
  },
};