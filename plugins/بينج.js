module.exports = {
  command: ['بينج'],
  description: 'فحص سرعة البوت والاتصال',
  category: 'المطور',
  
  async execute(sock, msg, args) {
    try {
      // الأرقام المحدثة للمطورين
      const DEVELOPERS = ['272344446701714', '106790838616138'];
      
      // استخراج الرقم من JID أو LID
      const senderJid = msg.key.participant || msg.key.remoteJid;
      // قمنا بتعديل طريقة الفحص لتشمل كلا من الأرقام العادية و الـ LID
      const isDeveloper = DEVELOPERS.some(dev => senderJid.includes(dev));
      
      // التحقق من المطور
      if (!isDeveloper) {
        return await sock.sendMessage(msg.key.remoteJid, {
          text: '🚫 هذا الأمر حصري للمطورين'
        }, { quoted: msg });
      }
      
      // ... باقي الكود الخاص بك كما هو ...
