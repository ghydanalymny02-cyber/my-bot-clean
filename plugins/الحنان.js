module.exports = {
  command: ['الحنان'],
  description: 'رسالة الخير والفيديو المرفق.',
  usage: '.الحنان',
  category: 'ترفيه',

  async execute(sock, msg, args) {
    try {
      const videoUrl = 'https://files.catbox.moe/vt4e2v.mp4';

      const caption = `🥹💛 زيت جونسون *معا للخير*
هو الراعي الأول للخير
نحن نحب الخير لغيرنا
حب الغير هو الأولوية
معا لنشر الخير
✨ شعارنا هو : *نحب الخير للغير*`;

      // إرسال الفيديو مع الـ caption
      await sock.sendMessage(msg.key.remoteJid, {
        video: { url: videoUrl },
        caption: caption,
        mimetype: 'video/mp4'
      }, { quoted: msg });

    } catch (err) {
      console.error('خطأ في أمر الحنان:', err);
    }
  }
};