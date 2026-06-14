const fs = require('fs');
const path = require('path');
const axios = require('axios');
const { exec } = require('child_process');

// دالة التحويل عبر ffmpeg مع معالجة الأخطاء
const convertToWebp = (inputFile, outputFile) => {
  return new Promise((resolve, reject) => {
    exec(`ffmpeg -i "${inputFile}" -vcodec libwebp -filter_complex "scale='if(gt(a,1),512,-1)':'if(gt(a,1),-1,512)',pad=512:512:(512-iw)/2:(512-ih)/2:color=0x00000000" "${outputFile}" -y`, (err) => {
      if (err) return reject(err);
      resolve(outputFile);
    });
  });
};

module.exports = {
  command: ['حزمة', 'stickers'],
  description: 'حزمة ملصقات ذكية ومقاومة للحظر',
  usage: '.حزمة [لوفي / انمي]',
  category: 'fun',

  async execute(sock, msg, args) {
    const chatId = msg.key.remoteJid;
    const choice = args && args.length > 0 ? args[0].trim() : 'انمي';

    await sock.sendMessage(chatId, { text: `⏳ جاري معالجة حزمة ( *${choice}* )... يرجى الانتظار.` }, { quoted: msg });

    // مصفوفة روابط الصور (تم إكمالها)
    let stickersUrls = choice === 'لوفي' || choice === 'luffy' 
      ? [
          'https://images.unsplash.com/photo-1541562232579-512a21360020?w=512&h=512&fit=crop',
          'https://images.unsplash.com/photo-1608889174637-3c99800e1791?w=512&h=512&fit=crop',
          'https://images.unsplash.com/photo-1613376023733-0a73315d9b06?w=512&h=512&fit=crop'
        ]
      : [
          'https://images.unsplash.com/photo-1578632767115-351597cf2477?w=512&h=512&fit=crop',
          'https://images.unsplash.com/photo-1581833971358-2c8b550f20b3?w=512&h=512&fit=crop',
          'https://images.unsplash.com/photo-1560972550-13782352a8d3?w=512&h=512&fit=crop'
        ];

    const tempFolder = path.join(process.cwd(), 'temp');
    if (!fs.existsSync(tempFolder)) fs.mkdirSync(tempFolder);

    try {
      for (const url of stickersUrls) {
        const inputPath = path.join(tempFolder, `input_${Date.now()}.jpg`);
        const outputPath = path.join(tempFolder, `output_${Date.now()}.webp`);
        
        // تحميل الصورة
        const response = await axios({ url, responseType: 'arraybuffer' });
        fs.writeFileSync(inputPath, response.data);

        // تحويل الصورة
        await convertToWebp(inputPath, outputPath);

        // إرسال كملصق
        await sock.sendMessage(chatId, { 
            sticker: fs.readFileSync(outputPath) 
        });

        // تنظيف الملفات المؤقتة
        fs.unlinkSync(inputPath);
        fs.unlinkSync(outputPath);
      }
      await sock.sendMessage(chatId, { text: '✅ تم إرسال الحزمة بنجاح!' }, { quoted: msg });
    } catch (err) {
      console.error(err);
      await sock.sendMessage(chatId, { text: '❌ حدث خطأ أثناء معالجة الحزمة.' }, { quoted: msg });
    }
  }
};

