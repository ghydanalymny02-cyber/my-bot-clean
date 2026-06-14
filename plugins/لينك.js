module.exports = {
  command: 'لينك',
  description: 'يعطي رابط دعوة المجموعة الحالية',
  category: 'group',

  async execute(sock, msg, args = []) {
    const chatId = msg.key.remoteJid;

    if (!chatId.endsWith('@g.us')) {
      return sock.sendMessage(chatId, { text: '❌ هذا الأمر يعمل فقط في المجموعات.' }, { quoted: msg });
    }

    try {
      // استدعاء رابط دعوة المجموعة
      const inviteCode = await sock.groupInviteCode(chatId);
      const inviteLink = `https://chat.whatsapp.com/${inviteCode}`;

      await sock.sendMessage(chatId, {
        text: `🔗 رابط دعوة المجموعة:\n${inviteLink}`
      }, { quoted: msg });

    } catch (error) {
      await sock.sendMessage(chatId, { text: `❌ حدث خطأ أثناء جلب الرابط: ${error.message}` }, { quoted: msg });
    }
  }
};