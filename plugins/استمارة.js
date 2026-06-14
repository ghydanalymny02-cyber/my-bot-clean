module.exports = {
  command: 'استمارة',
  description: 'إرسال استمارة الترحيب للمنضمين',
  category: 'group',

  async execute(sock, msg) {
    try {
      const chatJid = msg.key.remoteJid;

      const formText = `
*『 بِسْمِ اللهِ الرَّحْمٰنِ الرَّحِيم 』*
╔═══════ ⌬⚔⌬ ═══════╗
      ✦ أهـلـاً بالمحارب ✦
╚═══════ ⌬⚔⌬ ═══════╝

*↯ انـت الآن فـي ⇣*
*『𝐇.𝐍.𝐄🔥مــجــهــول||𝕲𝕳𝕰𝕯𝕬𝕹』🍁┆اسـتـقـبـال┇*
❖━━━━━━━━━━⌬━━━━━━━━━━❖

*✥ 🎩 اللقب ◞ ┇ ˹*

*✥ 📜 اسم الأنمي ◞ ┇ ˹*

*✥ ⚖️ الجنس ◞ ┇ ˹*

*✥ ☀️ من طرف ◞ ┇ ˹*

❖━━━━━━━━━━⌬━━━━━━━━━━❖

*⚠️ تنبيه هام ┇ ممنوع البنت تأخذ لقب ولد والعكس*

❖━━━━━━━━━━⌬━━━━━━━━━━❖
*✺ توقيع الإدارة ☇*
『الـظـلام🔥مـمـلـگـة』
      `;

      await sock.sendMessage(chatJid, {
        text: formText
      }, { quoted: msg });

    } catch (err) {
      console.error("خطأ في أمر .استمارة:", err);
      await sock.sendMessage(msg.key.remoteJid, {
        text: "⚠️ حصل خطأ أثناء تنفيذ الأمر."
      }, { quoted: msg });
    }
  }
};