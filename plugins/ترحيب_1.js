module.exports = {
  command: 'ترحيب',
  category: 'group',
  description: 'يرحب بعضو جديد عند منشنه برسالة مميزة مع اللقب',
  group: true,

  async execute(sock, msg) {
    const chatId = msg.key.remoteJid;

    if (!chatId.endsWith('@g.us')) {
      return sock.sendMessage(chatId, {
        text: '❌ هذا الأمر يعمل فقط في المجموعات.'
      }, { quoted: msg });
    }

    const mentioned = msg.message?.extendedTextMessage?.contextInfo?.mentionedJid;
    const messageText = msg.message?.extendedTextMessage?.text || '';

    if (!mentioned || mentioned.length === 0) {
      return sock.sendMessage(chatId, {
        text: '❌ منشن الشخص اللي عايز ترحب بيه، مثال:\n.ترحيب @123456789 اللقب: يوميلا'
      }, { quoted: msg });
    }

    const target = mentioned[0];
    const targetNumber = target.split('@')[0];

    // استخراج اللقب من النص (بعد "اللقب:")
    const nicknameMatch = messageText.match(/اللقب\s*[:：]\s*(.+)/i);
    const nickname = nicknameMatch ? nicknameMatch[1].trim() : 'غير محدد';

    const welcomeText = `
*✧╎『مرحباً بك يا* @${newMemberJid.split('@')[0]} ✨
في مجموعة: *${groupMetadata.subject}**_`;

    await sock.sendMessage(chatId, {
      text: welcomeText,
      mentions: [target]
    }, { quoted: msg });
  }
};