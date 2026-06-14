module.exports = {
  command: 'ايدي',
  description: '📇 يعرض معلوماتك في البوت',
  category: 'info',

  async execute(sock, msg) {
    const sender = msg.pushName || 'مستخدم';
    const number = msg.sender?.split('@')[0];

    await sock.sendMessage(msg.key.remoteJid, {
      text: `╭───〔 *معلوماتك* 〕───╮\n` +
            `👤 الاسم: ${sender}\n` +
            `📞 الرقم: ${967700821174}\n` +
            `💬 الحالة: موجود وجاهز 😎\n╰────────────⧉`
    }, { quoted: msg });
  }
};