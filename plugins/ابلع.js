
const fs = require('fs');
const path = require('path');

module.exports = {
  command: ['ابلع'],
  description: 'يرسل صورة مضحكة عند كتابة .ابلع',
  category: 'تسلية',
  async execute(sock, msg, args) {
    const chatId = msg.key.remoteJid;

    // مسار الصورة - تأكد من أن الصورة موجودة هنا
    const imagePath = '/storage/emulated/Download';

    // تحقق من وجود الصورة
    if (!fs.existsSync(imagePath)) {
      return await sock.sendMessage(chatId, {
        text: '❌ لم يتم العثور على الصورة المطلوبة.\n\n📁 ضع الصورة في المسار التالي:\n/storage/emulated/0/king/bot/media/abl3.jpg'
      });
    }

    // إرسال الصورة
    await sock.sendMessage(chatId, {
      image: fs.readFileSync(imagePath),
      caption: '📸 ابلع 😄'
    });
  }
};