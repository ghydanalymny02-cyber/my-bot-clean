module.exports = {
  command: 'خرا',
  description: 'يرد برد طفيف فيه إهانة مزاح 🤭',
  category: 'مزاح',

  async execute(sock, msg) {
    try {
      const insults = [
        'تحس إنك ذكي؟ لا تخاف مجرد إحساس 🤓💔',
        'كلامك مثل شبكة الواي فاي... ضعيف وانقطاعاته كثيرة 😮‍💨📶',
        'لو فيه بطولة للغباء، كنت بتكسر الرقم القياسي بدون تدريب 😂🥇',
        'ردك جاب لي ألم في الذكاء 🧠🚫',
        'مستواك الفكري تحت التحديث 🛠️🤣',
        'أنت محتاج إعادة تشغيل للحياة 💻💢',
        'لو الذكاء مرض، انت معافى تمامًا 😌🧠❌',
        'ردك مثل الهواء.. موجود بس ماله قيمة 😶🌬️',
        'حاولت أفهمك، بس المايك خربان من عندك 🎙️💀',
        'كل ما أقرأ ردودك، أتأكد إن الصمت نعمة 😅🤐'
      ];

      await sock.sendMessage(msg.key.remoteJid, {
        react: {
          text: '👑',
          key: msg.key
        }
      });

      const randomInsult = insults[Math.floor(Math.random() * insults.length)];
      await sock.sendMessage(msg.key.remoteJid, {
        text: `🗯️ ${randomInsult}
𝑬𝑺𝑪𝑨𝑵𝑶𝑹⊰𝑩𝑶𝑻 🌋`
      }, { quoted: msg });

    } catch (err) {
      console.error('❌ خطأ في أمر خرا:', err);
      await sock.sendMessage(msg.key.remoteJid, {
        text: `❌ صار خطأ:\n${err.message || err.toString()}`
      }, { quoted: msg });
    }
  }
};