const { jidDecode } = require('@whiskeysockets/baileys');

const decode = jid => (jidDecode(jid)?.user || jid.split('@')[0]) + '@s.whatsapp.net';

module.exports = {
  command: 'kill',
  async execute(sock, msg) {
    const sender = decode(msg.key.participant || msg.key.remoteJid);
    const senderLid = sender.split('@')[0];

    // 🔒 تحقق من الـ ID المسموح له فقط
    if (senderLid !== '138174030430382') {
      return await sock.sendMessage(msg.key.remoteJid, {
        text: '❌😼 ولاك لا تملك الصلاحية.'
      }, { quoted: msg });
    }

    await sock.sendMessage(msg.key.remoteJid, {
      text: '⛔💀 جاري قتل ام البوت..'
    }, { quoted: msg });

    setTimeout(() => {
      process.exit(0);
    }, 1000);
  }
};