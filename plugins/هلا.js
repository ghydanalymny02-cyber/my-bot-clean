module.exports = {
  category: 'tools',
  command: 'هلا',
  description: 'تحية جميلة',
  async execute(sock, msg) {
    const greetings = [
      'أهلاً وسهلاً 🌹',
      'مرحباً بك 👋',
      'هلا وغلا 🎊',
      'أهلاً بالضيف الكريم ✨',
      'هلا فيك نورت 🌟'
    ];
    const randomGreeting = greetings[Math.floor(Math.random() * greetings.length)];
    await sock.sendMessage(msg.key.remoteJid, {
      text: randomGreeting
    }, { quoted: msg });
  }
};