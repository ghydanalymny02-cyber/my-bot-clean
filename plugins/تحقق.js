module.exports = {
  command: 'تحقق',
  description: 'يتحقق من إذا البوت مشرف أو لا في القروب',

  async execute(sock, msg) {
    const chatId = msg.key.remoteJid;
    if (!chatId.endsWith('@g.us')) {
      return sock.sendMessage(chatId, { text: '❗ هذا الأمر يعمل فقط في القروبات.' }, { quoted: msg });
    }

    const metadata = await sock.groupMetadata(chatId);
    const participants = metadata.participants;
    const botJid = sock.user.id.split(':')[0] + '@s.whatsapp.net';

    const botData = participants.find(p => p.id === botJid);
    const isAdmin = !!botData?.admin;

    return sock.sendMessage(chatId, {
      text: isAdmin ? '🚫 *البوت ليس مشرفًا في هذا القروب.*' : '✅ *البوت مشرف في هذا القروب.*'
    }, { quoted: msg });
  }
};