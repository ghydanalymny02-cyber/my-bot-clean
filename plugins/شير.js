const { getGroupMembers } = require('../haykala/elite');

module.exports = {
  command: 'شير',
  category: 'اعلان',
  description: 'يعمل شير لمنشور الصحيفة بمنتشن جماعي',

  async execute(sock, msg) {
    const chatId = msg.key.remoteJid;

    // جلب كل الأعضاء للمنشن
    const groupMetadata = await sock.groupMetadata(chatId);
    const participants = groupMetadata.participants || [];
    const mentions = participants.map(p => p.id);

    // الرسالة المزغرفة
    const text = `
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
*»D𝐎𝐍'𝐓 𝐏𝑳𝐀𝐘 𝐖𝐈𝐓𝐇 𝑺𝑶𝑳𝑶»*

*~_اهلا فـي نقابة دايموند:_~*
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
*افضل حروب انمي*
*تعال و انضم مشرفين متفاعلين و أعضاء متفاعلين اكتر*
*لو مش مصدق تعال شوف بنفسك*
*و بنوزع ايفونات عايز ايفون تعال و هنديك احلى ايفون (كذب طبعا انا حتى مش معايا)*
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
*رابط الإستقبال:*
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
*『استقبال ⊰💎⊱ 𝐃𝐈𝐀𝐌𝐎𝐍𝐃』*
*~『 https://chat.whatsapp.com/Bdy4IzvJ5jx9XntUzcK9Cl?mode=ac_t 』~*

*يلا مستني ايه ادخل انا عارف ان العرض مش اقنعك بس ادخل ممكن يعجبك الجروب ࿕*
*_WELCOME TO HELL_*
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`;

    await sock.sendMessage(chatId, {
      text,
      mentions
    }, { quoted: msg });
  }
};