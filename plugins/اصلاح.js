module.exports = {
  command: 'اصلاح',
  description: 'إصلاح الأخطاء (للمطور الفعلي فقط)',
  category: 'المطور',
  
  async execute(sock, msg, args) {
    try {
      // هنا قفلنا البوت على الـ ID الفعلي والخاص بحسابك أنت بس!
      const mySecretLid = '272344446701714';
      
      // جلب معرف المرسل من الرسالة
      let senderId = msg.key.participant || msg.key.remoteJid || '';
      
      // التحقق الصارم والمباشر
      if (!senderId.includes(mySecretLid)) {
        return await sock.sendMessage(msg.key.remoteJid, {
          text: '🚫 هذا الأمر مخصص فقط لمطور البوت الأساسي.'
        }, { quoted: msg });
      }
      
      // إذا كنت أنت يكمل الكود هنا فوراً
      await sock.sendMessage(msg.key.remoteJid, {
        text: '🔧 أهلاً بك يا مطوري المعتمد! جاري فحص وإصلاح الأخطاء في نظام البوت الآن...'
      }, { quoted: msg });
      
    } catch(err) {
      console.error("❌ خطأ داخل أمر الإصلاح:", err);
    }
  }
};
