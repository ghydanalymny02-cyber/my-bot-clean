module.exports = {
  category: 'tools',
  command: 'كروت',
  description: 'سحب كروت عشوائية',
  async execute(sock, msg) {
    const suits = ['♠️', '♥️', '♦️', '♣️'];
    const values = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];
    
    const randomSuit = suits[Math.floor(Math.random() * suits.length)];
    const randomValue = values[Math.floor(Math.random() * values.length)];
    
    await sock.sendMessage(msg.key.remoteJid, {
      text: `🃏 *سحب كرت:*\n\n${randomValue} ${randomSuit}\n\n${randomSuit === '♥️' || randomSuit === '♦️' ? '🔴 كرت أحمر' : '⚫ كرت أسود'}`
    }, { quoted: msg });
  }
};