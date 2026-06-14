module.exports = {
  command: 'عبيد',
  description: '🧷 قائمة عبودية ساخرة لكل أعضاء الجروب',
  usage: '.عبيد',
  category: 'ترفيه',

  async execute(sock, msg) {
    const jid = msg.key.remoteJid;

    // تأكد إننا في جروب
    if (!jid.endsWith('@g.us')) {
      return await sock.sendMessage(jid, {
        text: '❌ هذا الأمر يعمل فقط داخل المجموعات.',
      }, { quoted: msg });
    }

    // جلب معلومات الجروب
    const metadata = await sock.groupMetadata(jid);
    const participants = metadata.participants;

    const labels = [
      'عبد تحت التدريب 👣',
      'ساحِب نعال الأمير 🥿',
      'عبد مخلص للذل 💀',
      'بيخدم في بلاط سيدي 🧹',
      'حامل طشت الغسيل 🪣',
      'عبد موهوب في الانبطاح 🤸',
      'غفير جراج سيده 🅿️',
      'بياكل من تحت الصفرا 😭',
      'عبد مؤقت بنظام الساعة ⏱️',
      'بيشتغل في سقاية جزم 🤲👞'
    ];

    let mentions = [];
    let result = `╭──〔 🧷 *قائمة العبيد* 〕──╮\n`;

    for (const p of participants) {
      const id = p.id || p.jid || p;
      const user = id.split('@')[0];
      const label = labels[Math.floor(Math.random() * labels.length)];

      mentions.push(id);
      result += `│ 🤲 *@${user}*: ${label}\n`;
    }

    result += `╰━━━━━━━━━━━━━━━━⧉`;

    await sock.sendMessage(jid, {
      text: result,
      mentions,
    }, { quoted: msg });
  }
};