module.exports = {
  category: 'tools',
  command: 'برج',
  description: 'حظك اليوم حسب برجك',
  async execute(sock, msg, args) {
    const horoscopes = {
      'الحمل': '♈ اليوم مناسب للمبادرة والشجاعة',
      'الثور': '♉ ركز على الاستقرار والأمان المالي',
      'الجوزاء': '♊ التواصل الاجتماعي سيكون في صالحك',
      'السرطان': '♋ العائلة والمنزل في بؤرة اهتمامك',
      'الأسد': '♌ اليوم يحمل فرصاً للتميز والقيادة',
      'العذراء': '♍ الانتباه للتفاصيل سيفيدك كثيراً',
      'الميزان': '♎ التوازن والعدالة مطلوبان اليوم',
      'العقرب': '♏ الشغف والعمق في العلاقات',
      'القوس': '♐ السفر والتعلم من الخبرات الجديدة',
      'الجدي': '♑ العمل الجاد سيؤتي ثماره',
      'الدلو': '♒ الأفكار المبتكرة ستلهمك اليوم',
      'الحوت': '♓ الحدس والإبداع في أوجهما'
    };
    
    const signs = Object.keys(horoscopes);
    
    if (!args || args.length < 1) {
      let signsList = "🔮 *قائمة الأبراج:*\n\n";
      signs.forEach((sign, index) => {
        signsList += `${index + 1}. ${sign}\n`;
      });
      
      signsList += "\n📝 *الاستخدام:* .برج <اسم البرج>\nمثال: .برج الأسد";
      
      return await sock.sendMessage(msg.key.remoteJid, {
        text: signsList
      }, { quoted: msg });
    }
    
    const signName = args.join(' ');
    const foundSign = signs.find(s => s.includes(signName) || signName.includes(s));
    
    if (foundSign && horoscopes[foundSign]) {
      await sock.sendMessage(msg.key.remoteJid, {
        text: `⭐ *برج ${foundSign}:*\n\n${horoscopes[foundSign]}\n\n✨ تقبلوا فائق الاحترام`
      }, { quoted: msg });
    } else {
      await sock.sendMessage(msg.key.remoteJid, {
        text: "❌ لم أتمكن من العثور على هذا البرج\n📋 اكتب .برج لرؤية القائمة الكاملة"
      }, { quoted: msg });
    }
  }
};