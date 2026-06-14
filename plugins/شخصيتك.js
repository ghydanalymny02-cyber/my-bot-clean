module.exports = {
  category: 'tools',
  command: 'شخصيتك',
  description: 'تحليل عشوائي لشخصيتك',
  async execute(sock, msg) {
    const personalities = [
      "🌟 *القائد:* شخصية قوية، تحب التحدي والمسؤولية",
      "💖 *الرومانسي:* حساس، عاطفي، يحب الجمال والفن",
      "🧠 *المفكر:* عقلاني، منطقي، يحب التحليل والتخطيط",
      "🎨 *المبدع:* متمرد، مبتكر، يكسر القواعد التقليدية",
      "🤝 *المساعد:* كريم، يهتم بالآخرين، يحب العطاء",
      "⚡ *المغامر:* شجاع، يحب المخاطرة والتجارب الجديدة",
      "🕊️ *السلامي:* هادئ، يحب الانسجام، يكره الصراعات"
    ];
    
    const personality = personalities[Math.floor(Math.random() * personalities.length)];
    
    await sock.sendMessage(msg.key.remoteJid, {
      text: `🧩 *تحليل الشخصية:*\n\n${personality}\n\n🔍 هل هذا يصفك؟`
    }, { quoted: msg });
  }
};