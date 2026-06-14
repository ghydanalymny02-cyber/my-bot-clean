module.exports = {
  command: ['منشن', 'mention'],
  description: '🔔 منشن مخفي لشخص معين',
  category: 'tools',

  async execute(sock, msg, args = []) {
    try {
      const groupJid = msg.key.remoteJid;

      if (!groupJid.endsWith('@g.us')) {
        return sock.sendMessage(groupJid, {
          text: '❌ هذا الأمر يعمل فقط في القروبات.'
        }, { quoted: msg });
      }

      // الرقم المستهدف (غيّره لرقم الشخص الذي تريده)
      const mentionNumber = '201234567890'; 
      const mentionJid = mentionNumber + '@s.whatsapp.net';

      // لإعطاء إيحاء بأنه "منشن مخفي"، نستخدم رسالة فارغة أو نقطة
      // مع وضع الرقم في الـ mentions
      await sock.sendMessage(groupJid, {
        text: '‌', // هذا حرف مخفي (Zero Width Joiner) يجعل الرسالة تبدو فارغة
        mentions: [mentionJid]
      }, { quoted: msg });

    } catch (err) {
      console.error('خطأ في أمر المنشن:', err);
      await sock.sendMessage(msg.key.remoteJid, {
        text: `❌ حدث خطأ أثناء تنفيذ الأمر.`
      }, { quoted: msg });
    }
  }
};
