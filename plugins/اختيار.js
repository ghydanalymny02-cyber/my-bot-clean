module.exports = {
  category: 'tools',
  command: 'اختيار',
  description: 'اختيار عشوائي من قائمة',
  async execute(sock, msg, args) {
    if (!args || args.length < 2) {
      return await sock.sendMessage(msg.key.remoteJid, {
        text: "⚠️ *الاستخدام:* .اختيار <خيار1> <خيار2> ...\nمثال: .اختيار بيتزا برجر سوشي"
      }, { quoted: msg });
    }
    
    const choice = args[Math.floor(Math.random() * args.length)];
    
    await sock.sendMessage(msg.key.remoteJid, {
      text: `🎯 *الاختيار:*\n\n${choice}\n\n✨ هذا هو الخيار الأنسب لك!`
    }, { quoted: msg });
  }
};