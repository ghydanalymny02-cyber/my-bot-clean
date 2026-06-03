module.exports = {
  command: ['اصلاح'],
  description: 'إصلاح الأخطاء',
  category: 'المطور',
  
  async execute(sock, msg, args) {
    try {
      const allowedNumbers = ['967715677073', '178817339498583'];
      let senderId = msg.key.participant || msg.key.remoteJid;
      let senderNumber = senderId.split('@')[0];
      
      const cleanNumber = (num) => num.replace(/^\+/, '').replace(/^0+/, '');
      const senderClean = cleanNumber(senderNumber);
      const isDeveloper = allowedNumbers.some(dev => senderClean === cleanNumber(dev));
      
      if (!isDeveloper) return await sock.sendMessage(msg.key.remoteJid, {
        text: '🚫 هذا الأمر للمطورين فقط'
      });
      
      await sock.sendMessage(msg.key.remoteJid, {
        text: '🔧 جاري إصلاح الأخطاء...'
      });
    } catch(err) {
      console.error("❌ خطأ:", err);
    }
  }
};