module.exports = {
  command: 'يابوت',
  description: 'يرد عليك البوت برسالة ترحيب ويوضح كيفية استخدامه',
  category: 'عام',
  usage: '.بوت',

  async execute(sock, msg) {
    const jid = msg.key.remoteJid;

    const reply = `
🤖 *أنـا البـوت مــجــهــول||𝕲𝕳𝕰𝕯𝕬𝕹* تم استدعائي بالأمر *.يابوت*

💡 أمثلة على الأوامر:
• .منشن 👥
• .تحدي 🎮
• .اوامر 📜

📌 لا تعرف الأوامر؟ أرسل:
*.اوامر* لعرض القائمة الكاملة 💜
❄ مــجــهــول||𝕲𝕳𝕰𝕯𝕬𝕹 𝑩𝒐𝒕꧂ `.trim();

    await sock.sendMessage(jid, {
      text: reply
    }, { quoted: msg });
  }
};