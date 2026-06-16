module.exports = {
  command: 'ادمني',
  description: 'ترقية العضو أو المطورين إلى مشرف (للمجموعات فقط)',
  group: true,
  botAdmin: true,

  async execute(sock, m, args = []) {
    const chatId = m.key.remoteJid;
    const senderJid = m.key.participant || m.key.remoteJid || '';
    
    // قائمة المطورين المعتمدين (تدعم LID والأرقام)
    const DEVELOPERS = ['272344446701714', '106790838616138'];
    
    // التحقق من الصلاحية
    const isDeveloper = DEVELOPERS.some(dev => senderJid.includes(dev));
    
    if (!isDeveloper) {
      return await sock.sendMessage(chatId, { 
        text: '🚫 هذا الأمر مخصص للمطورين فقط.' 
      }, { quoted: m });
    }

    const text = (args && args.length > 0) ? args.join(' ').trim() : '';

    // في حال طلب "المطورين"
    if (text === 'المطورين') {
      try {
        for (let devId of DEVELOPERS) {
          // نحول الـ LID إلى JID إذا لزم الأمر، أو نستخدمه مباشرة
          const targetJid = devId.includes('@') ? devId : devId + '@s.whatsapp.net';
          
          // محاولة الترقية (Promote) للمطور
          await sock.groupParticipantsUpdate(chatId, [targetJid], 'promote')
            .catch(err => console.log(`تعذر ترقية ${devId}:`, err.message));
        }
        await sock.sendMessage(chatId, { text: '✅ تم تعيين المطورين مشرفين (إذا كانوا موجودين بالمجموعة).' }, { quoted: m });
      } catch (e) {
        await sock.sendMessage(chatId, { text: '❌ حدث خطأ أثناء ترقية المطورين.' }, { quoted: m });
      }
    } else {
      // في حال الترقية الذاتية (ادمني)
      try {
        await sock.groupParticipantsUpdate(chatId, [senderJid], 'promote');
        await sock.sendMessage(chatId, { text: '✅ تم ترقيتك إلى مشرف بنجاح.' }, { quoted: m });
      } catch (err) {
        await sock.sendMessage(chatId, { text: '❌ حدث خطأ، تأكد أنني مشرف في المجموعة.' }, { quoted: m });
      }
    }
  }
};
