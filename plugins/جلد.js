module.exports = {
  command: 'جلد',
  description: '😈 جلد جماعي ساخر لأعضاء الجروب',
  usage: '.جلد',
  category: 'ترفيه',

  async execute(sock, msg) {
    const jid = msg.key.remoteJid;

    // تأكد أنه في جروب
    if (!jid.endsWith('@g.us')) {
      return await sock.sendMessage(jid, {
        text: '❌ هذا الأمر يعمل فقط داخل المجموعات.',
      }, { quoted: msg });
    }

    // جلب أعضاء الجروب
    const metadata = await sock.groupMetadata(jid);
    const participants = metadata.participants;

    // سبات جلد قوية
    const roasts = [
      'دماغك لو فتحتها تلاقي فيها صدى صوت وبطارية قلم 🔋',
      'أنت لو اتحبست في أوضة تفكير، تموت من الجوع 🧠❌',
      'أنت مش بس فاشل... دي وزارة الفشل عينتك سفيرها 💀',
      'لو في جائزة لأغبى بني آدم، كان اسمك محفور عليها 🏆🐸',
      'مستواك تحت الصفر، والعلماء بيستخدموك لقياس الغباء 💣',
      'أنت مثال حي إن التطور ممكن يراجع نفسه 🦧',
      'وشك لو دخل في فيلم رعب، الفيلم يتحول كوميدي 🎭',
      'عقلك عامل زي شبكة WiFi بدون إنترنت 📶🚫',
      'لو حاولت تكون مفيد، هتأذي الناس بدون قصد 🛠️',
      'أنت لو لعبت مع ظلك، هتخسر برضو 👥🤣'
    ];

    let mentions = [];
    let result = `╭━━〔 😈 *جلسة جلد جماعية* 〕━━╮\n`;

    for (const p of participants) {
      const id = p.id || p.jid || p;
      const user = id.split('@')[0];
      const roast = roasts[Math.floor(Math.random() * roasts.length)];
      mentions.push(id);
      result += `┃ 🔪 *@${user}*: ${roast}\n`;
    }

    result += `╰━━━━━━━━━━━━━━━━━━━━⧉`;

    await sock.sendMessage(jid, {
      text: result,
      mentions,
    }, { quoted: msg });
  }
};