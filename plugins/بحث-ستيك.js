const axios = require('axios');
const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');
const webp = require('node-webpmux');

const PACK = 
 'حــقــوق مــجــهــول||𝕲𝕳𝕰𝕯𝕬𝕹';
const AUTHOR = 'مــجــهــول||𝕲𝕳𝕰𝕯𝕬𝕹';

// إنشاء مجلد مؤقت داخل المشروع
const tmpDir = path.join(process.cwd(), 'tmp');
if (!fs.existsSync(tmpDir)) fs.mkdirSync(tmpDir);

function generateStickerID() {
  return require('crypto').randomBytes(16).toString('hex');
}

function buildExifBuffer(packname, author, id, description, emojis = ['🥺']) {
  const raw = {
    'sticker-pack-id': id,
    'sticker-pack-name': packname,
    'sticker-pack-publisher': author,
    'sticker-pack-desc': description,
    emojis
  };
  const data = Buffer.from(JSON.stringify(raw), 'utf8');
  const header = Buffer.from([
    0x49,0x49,0x2a,0x00,0x08,0x00,0x00,0x00,
    0x01,0x00,0x41,0x57,0x07,0x00,0x00,0x00,
    0x00,0x00,0x16,0x00,0x00,0x00
  ]);
  const exif = Buffer.concat([header, data]);
  exif.writeUIntLE(data.length, 14, 4);
  return exif;
}

async function addExifToWebp(webpBuffer, packname, author, description) {
  const img = new webp.Image();
  await img.load(webpBuffer);
  const id = generateStickerID();
  img.exif = buildExifBuffer(packname, author, id, description);
  return await img.save(null);
}

async function convertToWebpFFmpeg(inputPath, outputPath) {
  return new Promise((resolve, reject) => {
    const cmd = `ffmpeg -y -i "${inputPath}" -vcodec libwebp -filter:v "scale=512:512:force_original_aspect_ratio=decrease,fps=15" -lossless 1 -compression_level 6 -q:v 80 "${outputPath}"`;
    exec(cmd, (err) => err ? reject(err) : resolve());
  });
}

module.exports = {
  name: 'بحث-ملصق',
  command: ['ستيك'],
  category: 'tools',
  description: 'بحث عن صور وتحويلها لملصقات باستخدام FFmpeg وwebpmux',

  async execute(sock, msg, args = []) {
    try {
      const jid = msg.key.remoteJid;
      const queryText = args.join(' ') || msg.message?.conversation?.split(' ').slice(1).join(' ');
      if (!queryText) return sock.sendMessage(jid, { text: '⚠️ أدخل مصطلح البحث' }, { quoted: msg });

      const res = await axios.get(`https://api.siputzx.my.id/api/s/pinterest?query=${encodeURIComponent(queryText)}`);
      const results = res.data?.data?.filter(i => i.image_url) || [];
      if (results.length === 0) return sock.sendMessage(jid, { text: `❌ لم يتم العثور على صور لـ "${queryText}"` }, { quoted: msg });

      const selected = results.slice(0, Math.min(3, results.length));
      let successCount = 0;

      for (const [i, item] of selected.entries()) {
        try {
          const response = await axios.get(item.image_url, { responseType: 'arraybuffer' });
          const tempInput = path.join(tmpDir, `input_${i}.jpg`);
          const tempOutput = path.join(tmpDir, `sticker_${i}.webp`);

          // حفظ الصورة مؤقتًا
          fs.writeFileSync(tempInput, response.data);

          // تحويل الصورة إلى WebP باستخدام FFmpeg
          await convertToWebpFFmpeg(tempInput, tempOutput);

          // قراءة WebP النهائي وإضافة EXIF داخلي
          const webpBuffer = fs.readFileSync(tempOutput);
          const description = item.description || queryText;
          const stickerBuffer = await addExifToWebp(webpBuffer, PACK, AUTHOR, description);

          // إرسال الملصق
          await sock.sendMessage(jid, { sticker: stickerBuffer }, { quoted: msg });

          // حذف الملفات المؤقتة
          fs.unlinkSync(tempInput);
          fs.unlinkSync(tempOutput);

          successCount++;

        } catch (err) {
          console.error('⚠️ فشل الملصق:', err.message);
        }
      }

      await sock.sendMessage(jid, { text: `✅ تم إنشاء ${successCount} ملصق مع وصف داخلي باستخدام FFmpeg وwebpmux` }, { quoted: msg });

    } catch (err) {
      console.error('[بحث-ملصق] خطأ:', err.message);
      await sock.sendMessage(jid, { text: `❌ حدث خطأ أثناء إنشاء الملصقات:\n${err.message}` }, { quoted: msg });
    }
  }
};