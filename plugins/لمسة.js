module.exports = {
  command: ['لمسة'],
  description: '✨ إرسال لمسة سحرية أسطورية مع صورة البروفايل',
  category: 'تسلية',

  async execute(sock, msg) {
    try {
      const mentionedJid = msg.message?.extendedTextMessage?.contextInfo?.mentionedJid || [];
      if (mentionedJid.length === 0) {
        return await sock.sendMessage(msg.key.remoteJid, {
          text: '✨ لازم تمنشن الشخص: لمسة @الاسم'
        }, { quoted: msg });
      }

      const target = mentionedJid[0];

      // صورة البروفايل
      let profilePic = 'https://i.ibb.co/7CQVJNm/default.png';
      try {
        const url = await sock.profilePictureUrl(target, 'image');
        profilePic = url;
      } catch (err) {}

      // قائمة 30 عبارة سحرية أسطورية
      const magicalTouches = [
        "✨ شعاع من النور يلمس قلبك ويزيده سحرًا 🌟",
        "✨ روحك متوهجة كالنجم في السماء المظلمة 💫",
        "✨ لمسة الريح تقول لك: أنت الأقوى بين الجميع 🌀",
        "✨ كل همسة من قلبي تحوّلك إلى أسطورة حية 🏰",
        "✨ عيونك كالكريستال، كل لمعة فيها سحر 🪄",
        "✨ قلبي ينبض بإيقاع أسطوري عند رؤيتك 💖",
        "✨ الرياح تغني لك أغنية النجوم 🌌",
        "✨ كل خطوة تخطوها، يرافقك نور سحري ✨",
        "✨ ألوان الغروب تلمع في قلبك 🔥",
        "✨ أنت البطل الذي كل الأساطير تنتظره 🏹",
        "✨ دمك يحتوي على سحر الفجر والليل معًا 🌙",
        "✨ كل كلمة منك تطلق تعويذة حب وعشق 💘",
        "✨ الكون كله يصمت عند سماع صوتك 🎶",
        "✨ شعاع من الشمس يبتسم لك وحدك 🌞",
        "✨ النجوم تتراقص فرحًا عندما تضحك ⭐",
        "✨ روحك كالزهرة التي لا تذبل أبدًا 🌺",
        "✨ كل لمسة منك تخلق عالمًا جديدًا 🪄",
        "✨ الريح تحمل اسمك عبر الغابة 🏞️",
        "✨ قلبك يشع نورًا يضيء كل مكان 🕯️",
        "✨ أنت الأسطورة التي كل الحكايات تحكي عنها 🏰",
        "✨ السحر الحقيقي في كل خطوة تخطوها 🌀",
        "✨ الليل يصبح مليئًا بالألوان عند وجودك 🌌",
        "✨ كل نظرة منك تطلق نجومًا في السماء 🌟",
        "✨ أنت الفارس الذي يملك المفتاح لكل الأسرار 🗝️",
        "✨ كل همسة منك تحمل تعويذة سحرية 💫",
        "✨ روحك كالشمس المشرقة في الصباح 🌞",
        "✨ النجوم تتبعك في كل مكان 🌠",
        "✨ قلبك ينبض بسحر لا يعرفه أحد 💖",
        "✨ كل لحظة معك تصبح أسطورة لا تُنسى ✨",
        "✨ أنت شعاع النور في عالم مظلم 🌟"
      ];

      // اختيار عبارة عشوائية
      const randomMagic = magicalTouches[Math.floor(Math.random() * magicalTouches.length)];

      // إرسال الصورة + العبارة
      const sentMsg = await sock.sendMessage(msg.key.remoteJid, {
        image: { url: profilePic },
        caption: randomMagic,
        mentions: [target]
      }, { quoted: msg });

      // إضافة تفاعل ✨
      await sock.sendMessage(msg.key.remoteJid, {
        react: { text: '✨', key: sentMsg.key }
      });

    } catch (err) {
      console.error('❌ خطأ في أمر لمسة:', err);
      await sock.sendMessage(msg.key.remoteJid, {
        text: '❌ حصل خطأ أثناء تنفيذ أمر اللمسة السحرية.'
      }, { quoted: msg });
    }
  }
};