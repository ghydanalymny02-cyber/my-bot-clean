module.exports = {
  command: 'ن',
  description: 'عرض تفاصيل الهوية بشكل مرعب.',
  category: 'info',

  async execute(sock, msg) {
    const jid = msg.key.remoteJid;

    const info = `
🔻⚠️【⚠️ تحذير أمني ⚠️】🔻

- ✦ المنظمة : 𝑵𝑰𝑻𝑹𝑶 🌐
- ✦ المطور : 𝒀𝑼𝑴𝑰𝑳𝑨  ❄
- ✦ آخر تعديل : 📆 25 / 7 / 2025

⛔ أي محاولة نسخ أو تقليد سيتم تتبعها...
☠️ النظام مؤمن بكود جحيمي.

━━━━━━━━━━━━━━
`;

    await sock.sendMessage(jid, { text: info }, { quoted: msg });
  }
};