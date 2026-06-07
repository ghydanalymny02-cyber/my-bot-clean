const { isElite } = require('../haykala/elite.js');
const { jidDecode } = require('@whiskeysockets/baileys');

const getNumber = (jid) => {
  const decoded = jidDecode(jid);
  return decoded?.user || jid.split('@')[0];
};

module.exports = {
  command: 'عنصرية',
  description: 'طرد أعضاء حسب رمز الدولة أو عرض نسب الدول في المجموعة',
  usage: '.عنصرية +20 أو .عنصرية نسبة',

  async execute(sock, msg) {
    try {
      const jid = msg.key.remoteJid;
      const senderJid = msg.key.participant || msg.key.remoteJid;
      const senderNumber = getNumber(senderJid);

      if (!jid.endsWith('@g.us')) {
        return await sock.sendMessage(jid, { text: '❌ هذا الأمر يعمل فقط في المجموعات.' }, { quoted: msg });
      }

      if (!isElite(senderNumber)) {
        return await sock.sendMessage(jid, { text: '❌ هذا الأمر مخصص للنخبة فقط.' }, { quoted: msg });
      }

      const meta = await sock.groupMetadata(jid);
      const participants = meta.participants;
      const admins = participants.filter(p => p.admin).map(p => p.id);

      const validMembers = participants.filter(p => p.id).map(p => ({
        id: p.id,
        number: getNumber(p.id)
      })).filter(m => /^\d+$/.test(m.number)); // فقط اللي أرقامهم واضحة

      const body = msg.message?.extendedTextMessage?.text || msg.message?.conversation || '';
      const lower = body.toLowerCase();

      if (lower.includes('نسبة')) {
        const countryCounts = {};

        for (const member of validMembers) {
          const prefix = member.number.slice(0, 3);
          if (!countryCounts[prefix]) countryCounts[prefix] = 0;
          countryCounts[prefix]++;
        }

        const total = validMembers.length;
        const sorted = Object.entries(countryCounts).sort((a, b) => b[1] - a[1]).slice(0, 10);

        if (sorted.length === 0) {
          return sock.sendMessage(jid, { text: '❌ لا يوجد أعضاء يمكن تحليل أرقامهم حالياً.' }, { quoted: msg });
        }

        let message = '*📊 أكثر رموز الدول بالمجموعة:*\n\n';
        for (const [prefix, count] of sorted) {
          const percentage = ((count / total) * 100).toFixed(1);
          message += `• +${prefix} = ${count} عضو (${percentage}%)\n`;
        }

        message += `\nالحين اختار.. على مين تبي تتعنصر؟`;
        return sock.sendMessage(jid, { text: message }, { quoted: msg });
      }

      const match = lower.match(/\+(\d{1,4})/);
      if (!match) {
        return sock.sendMessage(jid, {
          text: '❗ يرجى استخدام الأمر بهذا الشكل:\n• .عنصرية +20\n• .عنصرية نسبة'
        }, { quoted: msg });
      }

      const code = match[1];

      const toKick = validMembers.filter(p =>
        p.number.startsWith(code) &&
        p.number !== senderNumber &&
        !admins.includes(p.id) &&
        !isElite(p.number)
      );

      if (toKick.length > 0) {
        const ids = toKick.map(p => p.id);
        await sock.groupParticipantsUpdate(jid, ids, 'remove');
        return sock.sendMessage(jid, {
          text: `✅ تمت العنصرية بنجاح على +${code}.`
        }, { quoted: msg });
      } else {
        return sock.sendMessage(jid, {
          text: `❌ ما في أعضاء تبدأ أرقامهم بـ +${code} يمكن طردهم.`
        }, { quoted: msg });
      }

    } catch (error) {
      console.error('❌ خطأ في أمر عنصرية:', error);
      await sock.sendMessage(msg.key.remoteJid, {
        text: '❌ حدث خطأ أثناء تنفيذ الأمر.'
      }, { quoted: msg });
    }
  }
};
