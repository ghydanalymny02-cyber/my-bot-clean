// *حقوق مطورة يوميلا 🛡*
// 📄 *تنبيه.js*

module.exports = {
  command: ['تنبيه'],
  description: '⚠️ يرسل تنبيه مهم مع منشن للجميع',
  category: 'info',

  async execute(sock, msg) {
    try {
      const groupMetadata = await sock.groupMetadata(msg.key.remoteJid);
      const participants = groupMetadata.participants.map(p => p.id);

      const infoText = `
⚠️ تنبيه ملكي ❄
رجاءً الالتزام بالقوانين، يوميلا لا تتهاون مع الفوضى.
`.trim();

      await sock.sendMessage(msg.key.remoteJid, { text: infoText, mentions: participants }, { quoted: msg });
    } catch (err) {
      console.error('❌ خطأ في أمر تنبيه:', err);
    }
  }
};