// *حقوق مطورة يوميلا 🛡*
// 📄 *نصيحة.js*

module.exports = {
  command: ['نصيحة'],
  description: '💡 يرسل نصيحة عشوائية',
  category: 'fun',

  async execute(sock, msg) {
    try {
      const advices = [
        "💡 لا تبحث عن الهيبة، اجعلها تأتيك بالثقة.",
        "💡 الفخامة في البساطة، لا في التعقيد.",
        "💡 المزروف الحقيقي هو من يفرض حضوره بلا كلام.",
        "💡 اجعل ولاءك لمن يستحق فقط.",
        "💡 لا تنس أن الضحكة هيبة أيضًا."
      ];
      const randomAdvice = advices[Math.floor(Math.random() * advices.length)];

      await sock.sendMessage(msg.key.remoteJid, { text: randomAdvice }, { quoted: msg });
    } catch (err) {
      console.error('❌ خطأ في أمر نصيحة:', err);
    }
  }
};