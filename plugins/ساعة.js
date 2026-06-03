module.exports = {
  category: 'tools',
  command: 'ساعة',
  description: 'ساعة إسلامية',
  async execute(sock, msg) {
    const now = new Date();
    const hours = now.getHours();
    const minutes = now.getMinutes();
    
    let islamicTime;
    if (hours < 3) islamicTime = 'وقت السحر 🌙';
    else if (hours < 6) islamicTime = 'وقت الفجر 🌅';
    else if (hours < 12) islamicTime = 'وقت الضحى ☀️';
    else if (hours < 15) islamicTime = 'وقت الظهر 🕋';
    else if (hours < 18) islamicTime = 'وقت العصر 🌤️';
    else if (hours < 20) islamicTime = 'وقت المغرب 🌇';
    else islamicTime = 'وقت العشاء 🌌';
    
    await sock.sendMessage(msg.key.remoteJid, {
      text: `🕌 *الساعة الإسلامية:*\n\n⏰ ${hours}:${minutes}\n📿 ${islamicTime}\n\n🌟 ذكر الله في كل وقت`
    }, { quoted: msg });
  }
};