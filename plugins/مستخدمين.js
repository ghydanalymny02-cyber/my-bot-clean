module.exports = {
  command: ['مستخدمين'],
  description: '⚙️ يعرض معلومات البوت',
  category: 'المعلومات',

  async execute(sock, msg) {
    try {
      const totalCommands = 500; // عدد الأوامر
      const usersCount = 1;     // عدد المستخدمين
      const today = new Date().toLocaleDateString('ar-EG');

      const infoText = `
╭───〔 *مــجــهــول||𝕲𝕳𝕰𝕯𝕬𝕹⊰𝑩𝑶𝑻* 〕───╮
│ ⚙️ عـدد الأوامـر : ${totalCommands}
│ 👥 مستخدمين البوت : ${usersCount}
│ 📅 التاريخ : ${today}
╰───────────────────╯
مــجــهــول||𝕲𝕳𝕰𝕯𝕬𝕹⊰𝑩𝑶𝑻 🌋`;

      await sock.sendMessage(
        msg.key.remoteJid,
        { text: infoText },
        { quoted: msg }
      );

    } catch (e) {
      console.error("خطأ في أمر البوت:", e);
      await sock.sendMessage(
        msg.key.remoteJid,
        { text: "❌ صار خطأ." },
        { quoted: msg }
      );
    }
  }
};

      