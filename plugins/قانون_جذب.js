module.exports = {
  category: 'tools',
  command: 'قانون_جذب',
  description: 'قوانين الجذب',
  async execute(sock, msg) {
    const attractionLaws = [
      "🔮 *التخيل:* تخيل نفسك وقد حققت هدفك، بأدق التفاصيل",
      "💭 *التوكيد:* كرر جملة إيجابية عن نفسك كل يوم",
      "🌟 *الشكر:* اشعر بالامتنان لما تملكه الآن",
      "🎯 *التركيز:* ركز على ما تريد، لا على ما لا تريد",
      "💖 *المشاعر:* اجعل مشاعرك إيجابية أثناء التخيل"
    ];
    const randomLaw = attractionLaws[Math.floor(Math.random() * attractionLaws.length)];
    
    await sock.sendMessage(msg.key.remoteJid, {
      text: `🧲 *قانون من قوانين الجذب:*\n\n${randomLaw}\n\n💫 طبقه في حياتك اليوم!`
    }, { quoted: msg });
  }
};module.exports = {
  command: 'قانون_جذب',
  description: 'قوانين الجذب',
  async execute(sock, msg) {
    const attractionLaws = [
      "🔮 *التخيل:* تخيل نفسك وقد حققت هدفك، بأدق التفاصيل",
      "💭 *التوكيد:* كرر جملة إيجابية عن نفسك كل يوم",
      "🌟 *الشكر:* اشعر بالامتنان لما تملكه الآن",
      "🎯 *التركيز:* ركز على ما تريد، لا على ما لا تريد",
      "💖 *المشاعر:* اجعل مشاعرك إيجابية أثناء التخيل"
    ];
    const randomLaw = attractionLaws[Math.floor(Math.random() * attractionLaws.length)];
    
    await sock.sendMessage(msg.key.remoteJid, {
      text: `🧲 *قانون من قوانين الجذب:*\n\n${randomLaw}\n\n💫 طبقه في حياتك اليوم!`
    }, { quoted: msg });
  }
};module.exports = {
  command: 'قانون_جذب',
  description: 'قوانين الجذب',
  async execute(sock, msg) {
    const attractionLaws = [
      "🔮 *التخيل:* تخيل نفسك وقد حققت هدفك، بأدق التفاصيل",
      "💭 *التوكيد:* كرر جملة إيجابية عن نفسك كل يوم",
      "🌟 *الشكر:* اشعر بالامتنان لما تملكه الآن",
      "🎯 *التركيز:* ركز على ما تريد، لا على ما لا تريد",
      "💖 *المشاعر:* اجعل مشاعرك إيجابية أثناء التخيل"
    ];
    const randomLaw = attractionLaws[Math.floor(Math.random() * attractionLaws.length)];
    
    await sock.sendMessage(msg.key.remoteJid, {
      text: `🧲 *قانون من قوانين الجذب:*\n\n${randomLaw}\n\n💫 طبقه في حياتك اليوم!`
    }, { quoted: msg });
  }
};