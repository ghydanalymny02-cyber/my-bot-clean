module.exports = {
  command: ['اذاعة'],
  description: 'إرسال رسالة لجميع مجموعات البوت - للمطورين فقط',
  category: 'المطور',
  
  async execute(sock, msg, args) {
    try {
      // قائمة المطورين المعتمدة (IDs + أرقام)
      const DEVELOPERS = ['967715677073', '967701227385', '272344446701714', '106790838616138'];
      
      // استخراج المعرف الفعلي للمرسل (سواء كان رقم أو LID)
      const senderJid = msg.key.participant || msg.key.remoteJid || '';
      
      // التحقق من أن أحد أرقام أو IDs المطور موجود داخل معرف المرسل
      const isOwner = DEVELOPERS.some(devId => senderJid.includes(devId));
      
      if (!isOwner) {
        return await sock.sendMessage(msg.key.remoteJid, {
          text: '🚫 هذا الأمر حصري للمطورين فقط'
        }, { quoted: msg });
      }
      
      // التحقق من وجود نص
      let messageText = args ? args.join(' ') : '';
      
      if (!messageText.trim()) {
        return await sock.sendMessage(msg.key.remoteJid, {
          text: '📝 **طريقة الاستخدام:**\n.اذاعة [نص الرسالة]'
        }, { quoted: msg });
      }
      
      // تنفيذ الإذاعة
      await startBroadcast(sock, messageText, senderJid);
      
    } catch (error) {
      console.error("❌ خطأ في أمر اذاعة:", error);
      await sock.sendMessage(msg.key.remoteJid, { text: `❌ حدث خطأ: ${error.message}` });
    }
  }
};

async function startBroadcast(sock, messageText, senderJid) {
  try {
    // جلب جميع المجموعات التي فيها البوت (تعديل تلقائي)
    const chats = await sock.groupFetchAllParticipating();
    const groupsToBroadcast = Object.keys(chats);
    
    await sock.sendMessage(senderJid, { text: `🚀 جاري الإرسال لـ ${groupsToBroadcast.length} مجموعة...` });
    
    let successCount = 0;
    for (let groupId of groupsToBroadcast) {
      try {
        await sock.sendMessage(groupId, { text: `📢 *إعلان من المطور:*\n\n${messageText}` });
        successCount++;
        await new Promise(resolve => setTimeout(resolve, 1000)); // تأخير لتجنب الحظر
      } catch (e) {
        console.error(`فشل الإرسال لـ ${groupId}`);
      }
    }
    
    await sock.sendMessage(senderJid, { text: `✅ تم إرسال الإذاعة بنجاح إلى ${successCount} مجموعة.` });
  } catch (error) {
    console.error("خطأ في الإذاعة:", error);
  }
}
