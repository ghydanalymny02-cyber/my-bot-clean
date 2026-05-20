module.exports = {
  name: 'كسل',
  command: ['كسل'],
  category: 'تسلية',
  description: 'يعرض نسبة الكسل مع صورة البروفايل للشخص المنشن',
  async execute(sock, msg) {
    const from = msg.key.remoteJid;
    const mentions = msg.message.extendedTextMessage?.contextInfo?.mentionedJid || [];

    if (mentions.length === 0) {
      return await sock.sendMessage(from, { text: '😴 اكتب .كسل مع منشن الشخص اللي تبي تعرف نسبة الكسل له!' }, { quoted: msg });
    }

    const target = mentions[0];
    const username = `@${target.split('@')[0]}`;
    const laziness = Math.floor(Math.random() * 101);

    const عبارات_كسل = [
      'كسله يخليه ينام حتى وهو صاحي 🛌',
      'كسله مطبيعي… حتى الشيطان يتعب معه 😅',
      'كسله يخلي الوقت يوقف عنده ⏳',
      'كسله يخلّي السرير أعز أصدقاؤه 🛏️',
      'كسله أسطوري… لو في بطولة فاز فيها 🏆',
      'كسله يخلي كل يوم إجازة ☕',
      'كسله يخلي النوم واجب وطني 🇾🇪😂',
      'كسله أكبر من هموم الدنيا كلها 😴',
      'كسله يخلي الساعة تمر كأنها سنة 🕰️',
      'كسله يخلي حتى الكسلان ينصدم 😵'
    ];

    const randomعبارة = عبارات_كسل[Math.floor(Math.random() * عبارات_كسل.length)];

    let profilePic;
    try {
      profilePic = await sock.profilePictureUrl(target, 'image');
    } catch {
      profilePic = 'https://i.ibb.co/sFhRz0H/default.jpg';
    }

    const form = `
😴✨ ꒰ استمارة الكسل ✧･ﾟ: *ೃ༄

🛌 الاسـم: ${username}
⏳ نسبة الكسل: *${laziness}%*
☕ الحالة: ${randomعبارة}

— 𝑬𝑺𝑪𝑨𝑵𝑶𝑹 ♔
`;

    await sock.sendMessage(from, { image: { url: profilePic }, caption: form, mentions }, { quoted: msg });
  }
};