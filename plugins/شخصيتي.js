module.exports = {
  command: 'شخصيتي',
  description: '🧠 يعطي تحليل عشوائي لشخصيتك',
  category: 'ترفيه',

  async execute(sock, msg) {
    const تحليلات = [
      '😎 شخصيتك قوية جدًا بس محدش فاهمك',
      '🤓 بتحب التفاصيل وبتلاحظ حاجات الكل بيطنشها',
      '🔥 عصبي أحيانًا بس قلبك طيب',
      '🦦 بتتصرف بعفوية وده اللي بيخليك مميز',
      '👀 غامض أكتر من اللازم... الناس مش عارفين تقربلك'
    ];
    const random = تحليلات[Math.floor(Math.random() * تحليلات.length)];

    await sock.sendMessage(msg.key.remoteJid, {
      text: `🧠 تحليل شخصيتك:\n${random}`
    }, { quoted: msg });
  }
};