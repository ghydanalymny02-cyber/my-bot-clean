module.exports = {
  category: 'tools',
  command: '1باي',
  description: 'رسالة وداع',
  async execute(sock, msg) {
    const farewells = [
      'مع السلامة 👋',
      'إلى اللقاء 🌙',
      'بالتوفيق ✨',
      'وداعاً، إلى لقاء قريب 🌹',
      'سر على بركة الله 🚶‍♂️'
    ];
    const randomFarewell = farewells[Math.floor(Math.random() * farewells.length)];
    await sock.sendMessage(msg.key.remoteJid, {
      text: randomFarewell
    }, { quoted: msg });
  }
};