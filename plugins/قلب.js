module.exports = {
  category: 'tools',
  command: 'قلب',
  description: 'لعبة قلب الحظ - اختر رقماً واربح جائزة',
  async execute(sock, msg) {
    const prizes = [
      "🎉 فزت ب 10 نقاط!",
      "💎 جائزة خاصة: إيموجي ذهبي!",
      "🎁 فزت بلعبة مجانية!",
      "🍀 حظك جيد اليوم!",
      "⭐ نجمة الحظ معك!",
      "🤞 حاول مرة أخرى!",
      "🎯 ربحت دخول السحب!",
      "🏆 المركز الأول!"
    ];
    
    // استخدام دالة عشوائية مباشرة بدون استيراد
    const getRandomInt = (min, max) => {
      return Math.floor(Math.random() * (max - min + 1)) + min;
    };
    
    const randomPrize = prizes[getRandomInt(0, prizes.length - 1)];
    
    await sock.sendMessage(msg.key.remoteJid, {
      text: `🔄 *قلب الحظ*\n\nاختر رقم من 1-8:\n${Array.from({length: 8}, (_, i) => `${i+1}. ❓`).join('\n')}\n\n🎰 اكتب .قلب <رقم>`
    }, { quoted: msg });
  }
};