module.exports = {
  command: 'خاص',
  description: 'ردود مضحكة على كلمة خاص 📩',
  category: 'مزاح',

  async execute(sock, msg) {
    try {
      const replies = [
        'خاص؟ وش عندك سر ☠️',
        'تعال خاص أكسر لك رأسك 😏',
        'خاص؟ أنت تحب الهدوء ولا إيش؟ 😂',
        'جايك يا مز 🫦.',
        'خاص؟ أجل الموضوع خطير 😎',
        'أنت ناوي تفضفض؟ 🫢📩',
        'تعال خاص نشرب شاي ☕',
        'خاص؟ لا يكون غراميات 😏❤️',
        'في الخاص؟ خلاص خلينا نختفي من هنا 🫣',
        'أهلاً وسهلاً بالزائر الخاص 💌',
        'خاص؟ يخي خفت 😭',
        'خاص؟ لا يكون جاي تشتم 💀',
        'تعال خاص بس بدون مشاكل 😎',
        'خاص؟ الحين أشوفك 🏃‍♂️💨',
        'تعال خاص وبسويك VIP 👑',
        'خاص؟ ترى أنا مشغول 😏',
        'خاص؟ أكيد الموضوع فيه شي 😏',
        'يلا على الخاص نحلها 🤝',
        'خاص؟ خلاص أنا جايك 💥',
        'خاص؟ الحين أرسل لك الرابط 😏'
      ];

      await sock.sendMessage(msg.key.remoteJid, {
        react: { text: '🫦', key: msg.key }
      });

      const randomReply = replies[Math.floor(Math.random() * replies.length)];
      await sock.sendMessage(msg.key.remoteJid, { text: randomReply }, { quoted: msg });

    } catch (err) {
      console.error('❌ خطأ في أمر خاص:', err);
    }
  }
};