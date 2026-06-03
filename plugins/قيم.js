module.exports = {
  command: "قيم",
  description: "🌟 يقيّم عضو من 1 إلى 100",
  category: "ترفيه",
  usage: ".تقييم [@عضو]",

  async execute(sock, msg) {
    let mentioned = msg.mentionedJid?.[0];
    const from = msg.key.remoteJid;

    // fallback: لو مفيش منشن، حاول تاخد أول جزء من args كرقم أو ID
    if (!mentioned && msg.args.length > 0) {
      const input = msg.args[0].replace(/[^0-9]/g, '');
      if (input.length > 5) mentioned = `${input}@s.whatsapp.net`;
    }

    if (!mentioned) {
      return sock.sendMessage(from, {
        text: "❗ استخدم الأمر مع منشن، مثال: `.قيم @العضو`"
      }, { quoted: msg });
    }

    const rating = Math.floor(Math.random() * 101);

    await sock.sendMessage(from, {
      text: `🌟 *تقييم العضو:* @${mentioned.split('@')[0]}\n🎯 ${rating}/100`,
      mentions: [mentioned]
    }, { quoted: msg });
  }
};