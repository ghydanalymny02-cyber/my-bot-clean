const axios = require('axios');
const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');

async function convertImageToWebpHighRes(inputBuffer, tempName = 'sticker') {
  return new Promise((resolve, reject) => {
    const tempDir = path.join(process.cwd(), 'temp');
    if (!fs.existsSync(tempDir)) fs.mkdirSync(tempDir);

    const inputPath = path.join(tempDir, `${tempName}.jpg`);
    const outputPath = path.join(tempDir, `${tempName}.webp`);

    fs.writeFileSync(inputPath, inputBuffer);

    // تحويل الصورة إلى WebP عالي الدقة (512-720px)
    const cmd = `ffmpeg -y -i "${inputPath}" -vf "scale='min(720,iw)':'min(720,ih)':force_original_aspect_ratio=decrease" "${outputPath}"`;

    exec(cmd, (err) => {
      fs.unlinkSync(inputPath);
      if (err) return reject(err);
      try {
        const webpBuffer = fs.readFileSync(outputPath);
        fs.unlinkSync(outputPath);
        resolve(webpBuffer);
      } catch (e) {
        reject(e);
      }
    });
  });
}

module.exports = {
  name: 'بحث-ملصق-HD',
  command: ['فخم'],
  category: 'tools',
  description: '🔍 البحث عن صور عالية الدقة وتحويلها لملصقات WebP',

  async execute(sock, msg, args = []) {
    try {
      const jid = msg?.key?.remoteJid;
      if (!jid) return;

      const queryText = args.join(' ') || msg.message?.conversation?.split(' ').slice(1).join(' ');
      if (!queryText) return sock.sendMessage(jid, { text: '⚠️ أدخل مصطلح البحث' }, { quoted: msg });

      const res = await axios.get(`https://api.siputzx.my.id/api/s/pinterest?query=${encodeURIComponent(queryText)}`);
      const results = res.data?.data?.filter(i => i.image_url) || [];

      if (results.length === 0) return sock.sendMessage(jid, { text: `❌ لم يتم العثور على صور لـ "${queryText}"` }, { quoted: msg });

      const count = Math.min(3, results.length); // الحد الأقصى 3 صور
      const selected = results.slice(0, count);

      let successCount = 0;
      for (const [i, item] of selected.entries()) {
        try {
          // استخدم الرابط الأكبر إذا متوفر
          const imageUrl = item.image_url.replace(/_small|_medium/, '_original');
          const response = await axios.get(imageUrl, { responseType: 'arraybuffer' });
          if (!response.data) continue;

          const webpBuffer = await convertImageToWebpHighRes(Buffer.from(response.data), `sticker_${Date.now()}_${i}`);
          await sock.sendMessage(jid, { sticker: webpBuffer }, { quoted: msg });
          successCount++;
        } catch (err) {
          console.error('⚠️ فشل ملصق:', err.message);
        }
      }

      await sock.sendMessage(jid, { text: `✅ تم إنشاء ${successCount} ملصق عالي الدقة بنجاح` }, { quoted: msg });

    } catch (err) {
      console.error('[بحث-ملصق-HD] خطأ:', err.message);
    }
  }
};