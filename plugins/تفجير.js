module.exports = {
  command: ['تفجير'],
  description: 'مزاح: تم تفجير الجروب الكوني 💥🌌',
  category: 'ترفيه',
  usage: '.تفجير [اسم الجروب]',
  group: true,

  async execute(sock, msg, args) {
    const from = msg.key.remoteJid;
    const text = (args && args.length > 0) ? args.join(" ") : "الجروب الكوني";

    const loadingSteps = [
      "☠️ تم تفعيل المحرك الكوني...",
      "🌚 جاري تحصين النجم المشرق...",
      "🫡 تم تحصين النجم...",
      "🫵🏻 جاري تبنيد مشرفين الأبعاد...",
      "🗣 تم تبنيد مشرفين المجرة...",
      "🌌 جاري حساب معدل الأضرار الكونية...",
      "🦾 حدث خطأ أثناء التبني، تم تصحيحه بواسطة فريق الأجرام...",
      "🚀 تم حساب المعدل وجاري عرض النتائج الكونية...",
      "✨ نجاح عملية تفجير الجروب الكوني!"
    ];

    const delay = ms => new Promise(res => setTimeout(res, ms));

    // 1) أرسل الرسالة الأولى وخزنها
    let sent = await sock.sendMessage(from, {
      text: "_*🚀🌌 ابدأ التفجير الكوني للجروب 🌠*_"
    }); // لو حابب تقتبس (quoted) ممكن تحط { quoted: msg } هنا

    // 2) جرب تعمل edit في كل خطوة
    for (let i = 0; i < loadingSteps.length; i++) {
      await delay(1000);
      try {
        // هيفشل لو النسخة قديمة → هنقع للـ catch
        await sock.sendMessage(from, {
          text: loadingSteps[i],
          edit: sent.key
        });
      } catch (e) {
        console.error('Edit failed, falling back —', e && e.message ? e.message : e);
        // fallback: ابعت رسالة جديدة وخلّي sent يساوي الرسالة الجديدة علشان التعديلات الجاية تمسك عليها
        try {
          sent = await sock.sendMessage(from, { text: loadingSteps[i] });
        } catch (err2) {
          console.error('Fallback send failed', err2);
        }
      }
    }

    // رسالة النتيجة النهائية — برضه نحاول نعملها edit
    const getRandomAge = () => Math.floor(Math.random() * 100) + 1;
    const getRandomWeight = () => (Math.random() * 100).toFixed(2);

    const response =
      `━━━━━━━⬣ *🚀🌌 انفجار كوني للجروب* ⬣━━━━━━━\n` +
      `*💫 معلومات الجروب الذي تم تفجيره 💫*\n` +
      `*الاسم:* ${text}\n` +
      `*الموقع:* واتساب\n` +
      `*العمر:* ${getRandomAge()} مليار سنة\n` +
      `*الوزن:* ${getRandomWeight()} كتلة كونية\n` +
      `━━━━━━━⬣ *🚀🌌* ⬣━━━━━━━`;

    await delay(1200);
    try {
      await sock.sendMessage(from, { text: response, edit: sent.key });
    } catch (e) {
      // لو فشل، نبعت رسالة عادية ونهتدي بيها
      await sock.sendMessage(from, { text: response });
    }
  }
};