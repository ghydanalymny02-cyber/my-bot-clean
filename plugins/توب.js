module.exports = {
  name: 'توب',
  command: ['توب'],
  category: 'ترفيه',
  description: '🎲 لعبة توب عشوائي بعدد ووصف من اختيارك',

  async execute(sock, m, args) {
    const groupId = m.key.remoteJid;

    // فك الرسالة يدويًا لو args فاضية
    if (!args || !Array.isArray(args) || args.length === 0) {
      const rawText = m.message?.extendedTextMessage?.text || m.message?.conversation || '';
      args = rawText.trim().split(' ').slice(1);
    }

    // لو مفيش رقم
    if (!args[0] || isNaN(args[0])) {
      return sock.sendMessage(groupId, {
        text: '❌ الاستخدام الصحيح:\n.توب <عدد> <وصف>\nمثال: .توب 4 مصريين',
      }, { quoted: m });
    }

    const count = parseInt(args[0]);
    if (count < 1) {
      return sock.sendMessage(groupId, {
        text: '❌ العدد لازم يكون أكبر من صفر.',
      }, { quoted: m });
    }

    const labelText = args.slice(1).join(' ').trim() || 'الجامدين';

    let groupName = 'جروبنا';
    let participants = [];

    try {
      const metadata = await sock.groupMetadata(groupId);
      groupName = metadata.subject;
      participants = metadata.participants
        .filter(p => !p.id.endsWith('g.us'))
        .map(p => p.id); // نخليها كاملة بالـ @s.whatsapp.net
    } catch (err) {
      return sock.sendMessage(groupId, {
        text: '❌ حصلت مشكلة في جلب بيانات الجروب 😔',
      }, { quoted: m });
    }

    if (participants.length < 2) {
      return sock.sendMessage(groupId, {
        text: '❗ مفيش أعضاء كفاية أرتبهم يا نجم 👻',
      }, { quoted: m });
    }

    // اختيار عشوائي
    participants = participants.sort(() => Math.random() - 0.5).slice(0, count);

    let msg = `╭──────〔🔥 تـــوب ${count} ${labelText} 🔥〕──────╮\n`;

    for (let i = 0; i < participants.length; i++) {
      const user = participants[i].split('@')[0]; // الرقم فقط للعرض
      msg += `│ ${i + 1}. @${user} 🧸\n`;
    }

    msg += `╰────────────────────────╯\n`;
    msg += `🧾 ${groupName} 👑`;

    await sock.sendMessage(groupId, {
      text: msg,
      mentions: participants // المنشن مضبوط زي "معاهده"
    }, { quoted: m });
  }
};