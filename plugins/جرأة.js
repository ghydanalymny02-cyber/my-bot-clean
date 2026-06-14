module.exports = {
  command: 'جرأة',
  description: 'يرسل تحديات جرأة عشوائية ومثيرة',
  category: 'games',

  async execute(sock, msg) {
    try {
      const dareList = [
        "😳 قل أكبر سر غريب لم تخبر به أحدًا!",
        "🔥 أرسل صورة سيلفي بدون فلتر الآن!",
        "💋 قل من أحببته سرًا ولم تجرؤ على الاعتراف له؟",
        "🤯 اعترف بأحرج موقف حصل لك أمام شخص مشهور!",
        "🎤 سجل صوت تقول فيه: 'أريد شخصًا يعانقني الآن'.",
        "📱 أرسل أحدث محادثة محرجة لديك.",
        "😈 غيّر اسمك في القروب إلى شيء مثير لمدة ساعة!",
        "👀 من هو الشخص الذي تراقبه سرًا؟",
        "❤️ أرسل رسالة حب لأكثر شخص معجب بك بالقروب!",
        "🎲 اقترح تحدي على شخص آخر بالقروب ويجب عليه تنفيذه.",
        "😵 اعترف بشيء فعلته ولا يصدقك أحد!",
        "💬 قل جملة محرجة بصوت مرتفع الآن في مكالمة صوتية أو تسجيل."
      ];

      const randomDare = dareList[Math.floor(Math.random() * dareList.length)];

      // تحديد المعرف الصحيح للرسالة والقائم بالإرسال
      const chatId = msg.key?.remoteJid || msg.chatId;
      const sender = msg.key?.participant || msg.sender || sock.user.id;

      if (!chatId) return; // إذا لم يوجد chatId لا نفعل شيئًا

      await sock.sendMessage(chatId, {
        text: `🎭 *تحدي الجرأة لك!*  

${randomDare}

───────────────
مــجــهــول||𝕲𝕳𝕰𝕯𝕬𝕹 ⊰ 𝑩𝑶𝑻 ❄`,
        mentions: [sender]  // الآن متوافق مع القروبات
      }, { quoted: msg });

    } catch (err) {
      console.error('⚠️ خطأ في أمر جرأة:', err);
      const chatId = msg.key?.remoteJid || msg.chatId;
      if (chatId) {
        await sock.sendMessage(chatId, {
          text: `❌ حدث خطأ أثناء تنفيذ أمر *جرأة*: ${err.message}`
        });
      }
    }
  }
};