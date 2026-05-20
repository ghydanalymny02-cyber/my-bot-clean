module.exports = {
  command: 'زنوج',
  description: '🏿 نسبة الزنوجة لكل أعضاء الجروب',
  usage: '.زنوج',
  category: 'ترفيه',

  async execute(sock, msg) {
    const jid = msg.key.remoteJid;

    // تأكد أنه في جروب
    if (!jid.endsWith('@g.us')) {
      return await sock.sendMessage(jid, {
        text: '❌ هذا الأمر يعمل فقط داخل المجموعات.',
      }, { quoted: msg });
    }

    // جلب معلومات الجروب
    const metadata = await sock.groupMetadata(jid);
    const participants = metadata.participants;

    // بناء الرسالة
    let mentions = [];
    let result = `╭───〔 🏿 *تقرير الزنوجة الجماعي* 〕───╮\n`;

    for (const p of participants) {
      const percentage = Math.floor(Math.random() * 101);
      const id = p.id || p.jid || p; // حسب نسخة Baileys
      const user = id.split('@')[0];
      mentions.push(id);
      result += `│ 👤 *@${user}* › *${percentage}%*\n`;
    }

    result += `╰━━━━━━━━━━━━━━━━━━⧉`;

    // إرسال الرسالة
    await sock.sendMessage(jid, {
      text: result,
      mentions,
    }, { quoted: msg });
  }
};