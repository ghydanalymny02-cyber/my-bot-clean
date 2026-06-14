const axios = require('axios');
const FormData = require('form-data');
const FileType = require('file-type');
const { downloadContentFromMessage } = require('@whiskeysockets/baileys');

// رفع الصورة على Catbox
const uploadToCatbox = async (buffer) => {
  const type = await FileType.fromBuffer(buffer);
  const ext = type ? type.ext : 'jpg';
  const form = new FormData();
  form.append('fileToUpload', buffer, `file.${ext}`);
  form.append('reqtype', 'fileupload');

  try {
    const response = await axios.post('https://catbox.moe/user/api.php', form, {
      headers: form.getHeaders ? form.getHeaders() : {},
    });

    const text = response.data;
    if (text.startsWith('https://')) return text;
    throw new Error('❌ فشل في رفع الملف ل Catbox: ' + text);
  } catch (error) {
    throw new Error(`فشل في رفع الملف: ${error.message}`);
  }
};

// تنزيل الميديا وتحويلها لـ Buffer
async function getBufferFromQuoted(quoted, type) {
  const stream = await downloadContentFromMessage(
    quoted[`${type}Message`],
    type
  );
  let buffer = Buffer.from([]);
  for await (const chunk of stream) {
    buffer = Buffer.concat([buffer, chunk]);
  }
  return buffer;
}

module.exports = {
  command: ['تزنيج'],
  description: '🧑🏿‍🦲 تحويل صورة بحيث البشرة تبقى سمراء',
  category: 'ai',

  async execute(sock, msg) {
    try {
      const quoted = msg.message?.extendedTextMessage?.contextInfo?.quotedMessage;
      if (!quoted || !quoted.imageMessage) {
        return sock.sendMessage(msg.key.remoteJid, {
          text: '❌ الصورة الي هتزنجها فين يا معلم؟ 🐦‍⬛',
        }, { quoted: msg });
      }

      await sock.sendMessage(msg.key.remoteJid, { text: '⏳ يتم التزنيج...' }, { quoted: msg });

      // نجيب البفر
      let buffer;
      try {
        buffer = await getBufferFromQuoted(quoted, "image");
      } catch (error) {
        throw new Error('❌ مش قادر أنزل الصورة من الرسالة.');
      }

      if (!buffer) throw new Error('❌ مش قادر أنزل الصورة، قد يكون حجمها كبير.');

      // رفع للصندوق
      const imgUrl = await uploadToCatbox(buffer);

      // برومبت افتراضي
      const prompt =
        "Change only the skin color to black while keeping all other elements exactly same including facial features, lighting, hair, clothing, pose, background and style. Make skin tone look natural with realistic texture.";

      // إرسال طلب المعالجة
      const processResponse = await axios.get(
        'https://emam-x-api.vercel.app/home/sections/Tools/api/api/process-image',
        { params: { imageUrl: imgUrl, prompt } }
      );

      const rid = processResponse.data.recordId;
      if (!rid) throw new Error('❌ فشل في الحصول على record ID');

      let resultUrl = null;
      while (!resultUrl) {
        await new Promise((resolve) => setTimeout(resolve, 3000));
        const checkResponse = await axios.get(
          'https://emam-x-api.vercel.app/home/sections/Tools/api/api/check-result',
          { params: { rid } }
        );

        if (checkResponse.data?.completed && checkResponse.data?.resultUrl) {
          resultUrl = checkResponse.data.resultUrl;
        }
      }

      // ابعت النتيجة
      await sock.sendMessage(
        msg.key.remoteJid,
        { image: { url: resultUrl }, caption: '✅ تم التزنيج 🧑🏿‍🦲👍🏿' },
        { quoted: msg }
      );
    } catch (e) {
      console.error('🚫 خطأ في أمر تزنيج:', e);
      await sock.sendMessage(
        msg.key.remoteJid,
        { text: `⚠️ حصل خطأ: ${e.message}` },
        { quoted: msg }
      );
    }
  },
};
