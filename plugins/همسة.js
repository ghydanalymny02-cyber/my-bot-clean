module.exports = {
  command: ['همسة'],
  description: '🌙 إرسال همسة سرية مع صورة البروفايل',
  category: 'تسلية',

  async execute(sock, msg) {
    try {
      const mentionedJid = msg.message?.extendedTextMessage?.contextInfo?.mentionedJid || [];
      if (mentionedJid.length === 0) {
        return await sock.sendMessage(msg.key.remoteJid, {
          text: '🌙 لازم تمنشن الشخص: همسة @الاسم'
        }, { quoted: msg });
      }

      const target = mentionedJid[0];

      // صورة البروفايل
      let profilePic = 'https://i.ibb.co/7CQVJNm/default.png';
      try {
        const url = await sock.profilePictureUrl(target, 'image');
        profilePic = url;
      } catch (err) {}

      // قائمة 30 عبارة سرية وغامضة
      const whispers = [
        "همسة خفية تقول لك: أنتَ أكثر شخص يشغل بالي 🌙",
        "همسة: الليل يذكرني بك أكثر من أي وقت 🌌",
        "همسة: لو كنت تعرف كم أفكر فيك الآن… 🫦",
        "همسة: عيناك سر كل أحلامي 💫",
        "همسة: كل نبضة قلبي تنادي باسمك 💖",
        "همسة: الليل طويل بدونك 🌙",
        "همسة: أنت سري الجميل الذي لا يعرفه أحد 🫣",
        "همسة: كل لحظة معك هي حلم لم أكن أظنه ممكن 💌",
        "همسة: أريد أن أخبرك بكل أسراري، لكن بخوف 🌌",
        "همسة: قلبي ملكك وحدك 💘",
        "همسة: كل ضحكة منك تجعل عالمي أفضل 🫦",
        "همسة: إذا كنت قريبًا، أشعر بالأمان 🌙",
        "همسة: كل همسة من قلبي لك وحدك 💖",
        "همسة: الليل أصبح أكثر جمالًا لأنك فيه 🌌",
        "همسة: أريد أن أحتفظ بك في قلبي للأبد 💫",
        "همسة: كل كلمة منك تشعل روحي 🔥",
        "همسة: أنت الأمان وسط كل الفوضى 🫦",
        "همسة: لو تعرف كم أحبك، لابتسمت 💖",
        "همسة: أنت سر سعادتي الخفية 🌙",
        "همسة: الليل لا يكتمل إلا بذكرك 💌",
        "همسة: كل لحظة أفكر فيها بك تصبح أطول 🌌",
        "همسة: أحب أن أخفي عن العالم مشاعري لك 🫦",
        "همسة: كل نبضة في قلبي لك فقط 💘",
        "همسة: الليل سريرنا ونحن أبطال الحكاية 💫",
        "همسة: أنت سر سري الذي لا يراه أحد 🌙",
        "همسة: كل مرة أراك، أحس أن الزمن يتوقف 🫣",
        "همسة: أريد أن أكتب اسمك في كل مكان في قلبي 💖",
        "همسة: أنت سبب كل سعادتي الخفية 🌌",
        "همسة: كل كلمة منك تجعلني أذوب 🫦",
        "همسة: أحبك بصمت، بلا صوت، بلا شهود 💌"
      ];

      // اختيار عبارة عشوائية
      const randomWhisper = whispers[Math.floor(Math.random() * whispers.length)];

      // إرسال الصورة + العبارة
      const sentMsg = await sock.sendMessage(msg.key.remoteJid, {
        image: { url: profilePic },
        caption: randomWhisper,
        mentions: [target]
      }, { quoted: msg });

      // إضافة تفاعل 🌙
      await sock.sendMessage(msg.key.remoteJid, {
        react: { text: '🌙', key: sentMsg.key }
      });

    } catch (err) {
      console.error('❌ خطأ في أمر همسة:', err);
      await sock.sendMessage(msg.key.remoteJid, {
        text: '❌ حصل خطأ أثناء تنفيذ أمر الهمسة.'
      }, { quoted: msg });
    }
  }
};