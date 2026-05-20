module.exports = {
  command: 'بلوك',
  description: 'حظر مستخدم من واتساب',
  category: 'admin',

  async execute(sock, msg, args) {
    try {
      const chatJid = msg.key.remoteJid;
      let targetJid;

      // إذا الأمر في الخاص → بلوك صاحب المحادثة
      if (!chatJid.endsWith('@g.us')) {
        targetJid = chatJid;
      } else {
        // إذا في قروب → نحتاج منشن
        const mentioned = msg.message?.extendedTextMessage?.contextInfo?.mentionedJid;
        if (!mentioned || mentioned.length === 0) {
          await sock.sendMessage(chatJid, {
            text: "⚠️ منشن الشخص اللي تبي تبلكه مثل:\n`.بلوك @الرقم`"
          }, { quoted: msg });
          return;
        }
        targetJid = mentioned[0];
      }

      // تنفيذ الحظر
      await sock.updateBlockStatus(targetJid, "block");

      await sock.sendMessage(chatJid, {
        text: `✅ تم حظر @${targetJid.split('@')[0]} بنجاح.`,
        mentions: [targetJid]
      }, { quoted: msg });

    } catch (err) {
      console.error("❌ خطأ في أمر .بلوك:", err);
      await sock.sendMessage(msg.key.remoteJid, {
        text: "⚠️ حصل خطأ أثناء تنفيذ أمر البلوك."
      }, { quoted: msg });
    }
  }
};