module.exports = {
  command: ['خاصك'],
  description: 'يرسل رسالة خاصة للشخص المحدد بالرد أو بالمنشن.',
  category: 'tools',

  async execute(sock, msg) {
    const chatId = msg.key.remoteJid;
    const quotedMsg = msg.message?.extendedTextMessage?.contextInfo?.quotedMessage;
    const mentionedJids = msg.message?.extendedTextMessage?.contextInfo?.mentionedJid || [];

    let targets = [];

    // إضافة الرد كهدف
    if (quotedMsg) {
      targets.push(msg.message.extendedTextMessage.contextInfo.participant);
    }

    // إضافة المنشنات كأهداف
    if (mentionedJids.length > 0) {
      targets.push(...mentionedJids);
    }

    if (targets.length === 0) {
      return await sock.sendMessage(chatId, { text: '❌ لازم ترد أو تمنشن الشخص!' }, { quoted: msg });
    }

    // النص بعد الأمر
    let message = '';
    if (msg.message.extendedTextMessage?.text) {
      // إزالة الأمر من النص
      let textWithoutCommand = msg.message.extendedTextMessage.text.replace(/^\S+\s*/, '');
      // إزالة المنشنات من النص
      mentionedJids.forEach(jid => {
        const mentionText = `@${jid.split('@')[0]}`;
        textWithoutCommand = textWithoutCommand.replace(mentionText, '');
      });
      message = textWithoutCommand.trim();
    }

    // لو مفيش نص بعد الأمر واستخدم رد
    if (!message && quotedMsg) {
      message = quotedMsg.conversation || 
                quotedMsg.extendedTextMessage?.text || 
                "هلا!";
    }

    // لو لسه مفيش نص نستخدم الافتراضي
    if (!message) message = "هلا!";

    // إرسال الرسالة لكل هدف
    for (const target of targets) {
      await sock.sendMessage(target, { text: message });
    }

    await sock.sendMessage(chatId, { text: '✅ تم ارسال الرسالة!' }, { quoted: msg });
  }
};