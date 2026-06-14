const fs = require('fs');

module.exports = {
  command: 'اشوف',
  description: '👑 عرض مالكي البوت والمحررين',
  usage: '.owner',
  category: 'tools',

  async execute(sock, msg) {
    try {
      const chatId = msg.key.remoteJid;

      // أرقام المالكين والمحررين
      const propietarios = ["967701227385"];
      const editores = ["967701227385", "+967701227385"];

      const mensaje = `╭───❖ 「 ♜مجــهــول 𝑩𝒐𝒕꧂ 」 ❖───╮
│
│ 👑 *المطور:*
${propietarios.map((n, i) => `│ ${i + 1}. ${n}`).join('\n')}
│
│ 📝 *النخبة:*
${editores.map((n, i) => `│ ${i + 1}. ${n}`).join('\n')}
│
╰────────────────────────╯
*♜مجــهــول 𝑩𝒐𝒕꧂*`;

      await sock.sendMessage(chatId, {
        text: mensaje,
        footer: '❄ مجــهــول 𝑩𝒐𝒕꧂',
        buttons: [
          {
            buttonId: "menu",
            buttonText: { displayText: "📜 قائمة البوت" },
            type: 1
          }
        ],
        headerType: 1
      }, { quoted: msg });

    } catch (err) {
      console.error('⚠️ خطأ في أمر owner:', err);
      await sock.sendMessage(msg.key.remoteJid, {
        text: `❌ حدث خطأ:\n${err.message || err.toString()}`
      }, { quoted: msg });
    }
  }
};