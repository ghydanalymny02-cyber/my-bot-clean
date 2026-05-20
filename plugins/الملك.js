const { jidNormalizedUser } = require('@whiskeysockets/baileys');
const { eliteNumbers } = require('../haykala/elite.js'); // قائمة النخبة

module.exports = {
  command: ['تاج'],
  description: '👑 استمارة فخمة تبين أن المستخدم من النخبة هو سيد القروب والبقية عبيد مع mentions.',
  category: 'الملك',

  async execute(sock, msg) {
    // جلب الرقم المرسل بشكل صحيح
    let sender = msg.key.participant || msg.key.remoteJid;
    let senderNumber = sender.includes('@') ? sender.split('@')[0] : sender;

    // السماح فقط لأعضاء النخبة
    if (!eliteNumbers.includes(senderNumber)) {
      return await sock.sendMessage(msg.key.remoteJid, {
        text: '❌ هذا الأمر مخصص للنخبة فقط 👑',
      }, { quoted: msg });
    }

    // جلب معلومات القروب
    const metadata = await sock.groupMetadata(msg.key.remoteJid);
    const groupName = metadata.subject;
    const participants = metadata.participants;

    // أسماء العبيد (الكل إلا النخبة الحالي)
    const slavesArray = participants
      .map(p => jidNormalizedUser(p.id))
      .filter(num => num.split('@')[0] !== senderNumber);

    // نص الاستمارة مع mentions
    const slavesText = slavesArray
      .map((jid, i) => `│ ${(i + 1).toString().padStart(2)}. 👤 @${jid.split('@')[0]}`)
      .join('\n') || "لا يوجد عبيد حالياً 😂";

    const text = `
╭───〔 👑 التاج الملكي 〕───⬣
│ 📛 القروب: *${groupName}*
│ 🏰 الملك: *${senderNumber}*
│ 🧎‍♂️ العبيد تحت الخدمة:
├─────⊷
${slavesText}
╰─────⊷
⚜️ عظمة الملك فوق الجميع ⚜️
    `.trim();

    // ارسال الرسالة مع mentions لكل عبد
    return await sock.sendMessage(msg.key.remoteJid, {
      text: text,
      mentions: slavesArray
    }, { quoted: msg });
  }
};