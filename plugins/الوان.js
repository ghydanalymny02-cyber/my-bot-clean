module.exports = {
  category: 'tools',
  command: 'الوان',
  description: 'عرض ألوان',
  async execute(sock, msg) {
    const colors = [
      { name: "🔴 أحمر", code: "#FF0000" },
      { name: "🟢 أخضر", code: "#00FF00" },
      { name: "🔵 أزرق", code: "#0000FF" },
      { name: "🟡 أصفر", code: "#FFFF00" },
      { name: "🟣 بنفسجي", code: "#800080" }
    ];
    const randomColor = colors[Math.floor(Math.random() * colors.length)];
    
    await sock.sendMessage(msg.key.remoteJid, {
      text: `🎨 *لون عشوائي:*\n\n${randomColor.name}\nكود HEX: ${randomColor.code}\n\n🌈 جرب استخدامه في تصميماتك`
    }, { quoted: msg });
  }
};