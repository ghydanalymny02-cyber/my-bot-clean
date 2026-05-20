module.exports = {
  command: 'وش',
  description: 'ردود تحدي على كلمة تعال 🥊🔥',
  category: 'مزاح',

  async execute(sock, msg) {
    try {
      const replies = [
        'أنا جايك ركض 🏃‍♂️💨',
        'تعال أنت، أنا مشغول 😏',
        'تعال ولا تخليني أجيك 💀',
        'يلا قدامك يا أسد 🦁',
        'تعال وخليك رجال ☠️',
        'يلا نلعبها صح 💥',
        'أنا جايك وأحسمها ⚔️',
        'تعال قبل ما أجيك 🚀',
        'تعال ووريني شجاعتك 💪',
        'تعال وأنا بانتظارك 🛡️',
        'جاهز أستقبلك 😎',
        'تعال ولا تكثر كلام 💀',
        'يلا هيا قدامك 🔥',
        'أنا جايك جري 🏃‍♂️',
        'تعال نحلها وجها لوجه ⚡'
      ];

      await sock.sendMessage(msg.key.remoteJid, {
        react: {
          text: '🔥',
          key: msg.key
        }
      });

      const randomReply = replies[Math.floor(Math.random() * replies.length)];
      await sock.sendMessage(msg.key.remoteJid, { text: randomReply }, { quoted: msg });

    } catch (err) {
      console.error('❌ خطأ في أمر تعال:', err);
    }
  }
};