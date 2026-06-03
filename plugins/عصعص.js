module.exports = {
  command: 'عصعص',
  description: 'سب عشوائي بيضان لمنشن',
  usage: '.عصعص @العضو',
  category: 'ترفيه',

  async execute(sock, msg) {
    // تحقق من وجود منشن
    const mentions = msg.message?.extendedTextMessage?.contextInfo?.mentionedJid;
    if (!mentions || mentions.length === 0) {
      return await sock.sendMessage(msg.key.remoteJid, {
        text: '❌ لازم تمنشن حد علشان أسبه يا عصعص.',
      }, { quoted: msg });
    }

    const target = mentions[0];
    const targetId = target.split('@')[0];

    // قائمة سبات عشوائية مضحكة
    const insults = [
      'أنت أغبى من صبونة نعامة 🧼',
      'شكلك زي الشبشب المقطوع 🤡',
      'أنت نسخة فاشلة من علبة سردين 🐟',
      'دماغك فاضية أكتر من جدول الحصص في العيد 📅',
      'وشك عامل زي شبكة الموزاية 😵‍💫',
      'أنت لو دخلت امتحان غباء هتنجح بتقدير امتياز 🧠💩',
      'اتولد عبقري وفضل يسحب لورا لحد ما وصل للغباء النقي 😂',
      'أنت العيب اللي محدش عارف يصلحه',
      'لو في مسابقة أغبى واحد، يوقفوك من أولها ويوزعوا الجائزة 🤷‍♂️',
      'نسبة الذكاء عندك بالسالب، والعلماء بيعملوا دراسة عليك 🧪'
    ];

    const randomInsult = insults[Math.floor(Math.random() * insults.length)];

    await sock.sendMessage(msg.key.remoteJid, {
      text: `📣 *@${targetId}*، ${randomInsult}`,
      mentions: [target]
    }, { quoted: msg });
  }
};