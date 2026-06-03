const axios = require('axios');
const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');
const crypto = require('crypto');

const PACK = `╮┄┄┄┄┄┄┄┄┄┄┄┄╭
𝙽𝚊𝚖𝚎 : 𝑤𝑖𝑙𝑙𝑖𝑎𝑚
⏱ ࣪𓏲ִ𝚃𝙷𝙴 𝚂𝚃𝙸𝙲𝙺𝚁 ⊹₊˚𖥔⸼
𝙾𝚠𝚗𝚎𝚛 : 𝑌𝑎𝑠𝑠𝑒𝑛
╯┄┄┄┄┄┄┄┄┄┄┄┄╰
⏱`;

const AUTHOR = `⏱
╮┄┄┄┄┄┄┄┄┄┄┄┄╭
꯭✿꯭᪲୭𓍢ִ  𝙱𝚈 →  𝑤𝑖𝑙𝑙𝑖𝑎𝑚 | 𝑏𝑜𝑡
╯┄┄┄┄┄┄┄┄┄┄┄┄╰`;

function errorTemplate(reason) {
  return `╭─〔 ⚠️ خطأ 〕─╮\n│ ${reason}\n╰───────────────╯`;
}

function generateStickerID() {
  return crypto.randomBytes(16).toString('hex');
}

async function convertImageToWebpFFmpeg(inputBuffer, tempName) {
  return new Promise((resolve, reject) => {
    const inputPath = path.join(process.cwd(), 'temp', `${tempName}.jpg`);
    const outputPath = path.join(process.cwd(), 'temp', `${tempName}.webp`);

    // تأكد أن مجلد temp موجود
    if (!fs.existsSync(path.join(process.cwd(), 'temp'))) {
      fs.mkdirSync(path.join(process.cwd(), 'temp'));
    }

    fs.writeFileSync(inputPath, inputBuffer);

    const cmd = `ffmpeg -y -i "${inputPath}" -vf "scale=512:512:force_original_aspect_ratio=decrease" "${outputPath}"`;
    exec(cmd, (err, stdout, stderr) => {
      fs.unlinkSync(inputPath); // حذف الصورة الأصلية بعد التحويل
      if (err) return reject(err);
      try {
        const webpBuffer = fs.readFileSync(outputPath);
        fs.unlinkSync(outputPath); // حذف الـ webp المؤقت
        resolve(webpBuffer);
      } catch (e) {
        reject(e);
      }
    });
  });
}

module.exports = {
  name: 'بحث-ملصق',
  command: ['مل'],
  category: 'tools',
  description: '🔍 البحث عن صور وتحويلها لملصقات',

  async execute(sock, msg, args = []) {
    try {
      const jid = msg?.key?.remoteJid;
      if (!jid) return;

      const queryText = args.join(' ') || msg.message?.conversation?.split(' ').slice(1).join(' ');
      if (!queryText) return sock.sendMessage(jid, { text: '⚠️ أدخل مصطلح البحث' }, { quoted: msg });

      const parts = queryText.split(' ');
      let query = queryText;
      let count = 3; // الحد الأقصى لتجنب انهيار Termux
      const lastPart = parseInt(parts[parts.length - 1]);
      if (!isNaN(lastPart) && lastPart > 0) {
        count = Math.min(lastPart, 3);
        query = parts.slice(0, -1).join(' ');
      }

      await sock.sendMessage(jid, { text: '⏳ جاري البحث عن الصور...' }, { quoted: msg });

      const res = await axios.get(`https://api.siputzx.my.id/api/s/pinterest?query=${encodeURIComponent(query)}`);
      const results = res.data?.data?.filter(i => i.image_url) || [];
      if (results.length === 0) return sock.sendMessage(jid, { text: `❌ لم يتم العثور على نتائج لـ "${query}"` }, { quoted: msg });

      const selected = results.slice(0, count);
      let successCount = 0;

      for (const [i, item] of selected.entries()) {
        try {
          if (!item.image_url) continue;
          const response = await axios.get(item.image_url, { responseType: 'arraybuffer' });
          if (!response.data) continue;

          const webpBuffer = await convertImageToWebpFFmpeg(Buffer.from(response.data), `sticker_${Date.now()}_${i}`);
          // أرسل الـ WebP كبوت WhatsApp
          await sock.sendMessage(jid, { sticker: webpBuffer }, { quoted: msg });
          successCount++;
        } catch (err) {
          console.error('⚠️ فشل ملصق:', err.message);
        }
      }

      await sock.sendMessage(jid, { text: `✅ تم إنشاء ${successCount} ملصق بنجاح` }, { quoted: msg });

    } catch (err) {
      console.error('[بحث-ملصق] خطأ:', err.message);
      // منع انهيار Termux
    }
  }
};