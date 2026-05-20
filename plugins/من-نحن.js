module.exports = {
  command: 'منن',
  description: 'عرض تفاصيل الهوية بشكل مرعب.',
  category: 'INFO',

  async execute(sock, msg) {
    const jid = msg.key.remoteJid;

    const info = `
🔻⚠️【⚠️ تحذير أمني ⚠️】🔻

- ✦ المنظمة : مــجــهــول||𝕲𝕳𝕰𝕯𝕬𝕹 ✨
- ✦ المطور : مــجــهــول||𝕲𝕳𝕰𝕯𝕬𝕹 🌋
- ✦ آخر تعديل : 📆 30 / 8 / 2025

⛔ أي محاولة نسخ أو تقليد سيتم تتبعها...
☠️ النظام مؤمن بكود جحيمي.

━━━━━━━━━━━━━━
`;

    await sock.sendMessage(jid, { text: info }, { quoted: msg });
  }
};