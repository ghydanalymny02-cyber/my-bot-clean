module.exports = {
  command: 'اصلاح',
  description: 'إصلاح الأخطاء (للمطورين فقط)',
  category: 'المطور',
  
  async execute(sock, msg, args) {
    try {
      // قائمة المطورين المعتمدين
      const DEVELOPER_LIDS = ['106790838616138', '272344446701714'];
      
      // جلب معرف المرسل من الرسالة
      const senderId = msg.key.participant || msg.key.remoteJid || '';
      
      // التحقق: هل معرف المرسل يحتوي على أحد الـ LID الموجودة في القائمة؟
      const isAuthorized = DEVELOPER_LIDS.some(lid => senderId.includes(lid));
      
      if (!isAuthorized) {
        return await sock.sendMessage(msg.key.remoteJid, {
          text: '🚫 هذا الأمر مخصص فقط لمطوري البوت الأساسيين.'
        }, { quoted: msg });
      }
      
      // إذا كان المرسل أحد المطورين المعتمدين، يتم تنفيذ الأمر
      await sock.sendMessage(msg.key.remoteJid, {
        text: '🔧 أهلاً بك يا مطوري المعتمد! جاري فحص وإصلاح الأخطاء في نظام البوت الآن...'
      }, { quoted: msg });
      
      // يمكنك هنا إضافة كود إعادة تشغيل البوت أو تنفيذ أوامر الإصلاح الفعلية
      
    } catch(err) {
      console.error("❌ خطأ داخل أمر الإصلاح:", err);
      await sock.sendMessage(msg.key.remoteJid, { text: '⚠️ حدث خطأ أثناء محاولة تنفيذ أمر الإصلاح.' });
    }
  }
};
