const { jidDecode } = require('@whiskeysockets/baileys');
const decode = jid => (jidDecode(jid)?.user || jid.split('@')[0]) + '@s.whatsapp.net';

const dir = [
  'https://telegra.ph/file/47980b59ec8bb7536b8c3.mp4',
  'https://telegra.ph/file/f5b44250d09185cdc5ceb.mp4',
  'https://telegra.ph/file/cc3c936f1c8a3011f4f61.mp4',
  'https://telegra.ph/file/720e5d6fd5b1db1d84fd1.mp4',
  'https://telegra.ph/file/73f99720578e60a185065.mp4',
  'https://telegra.ph/file/801bc2b575205d84fdd8c.mp4',
  'https://telegra.ph/file/984bb87dd03a92eee1a17.mp4',
  'https://telegra.ph/file/7097fb382329e9ad40b36.mp4',
  'https://telegra.ph/file/906199e5f8749000d0423.mp4',
  'https://telegra.ph/file/77348305d0298f1863b16.mp4',
  'https://telegra.ph/file/d91c04ed0c7ec4d93cf45.mp4',
  'https://telegra.ph/file/dac6f6ba7cf2e4f85f9f0.mp4',
];

module.exports = {
  command: 'الدون',
  description: 'يبعت فيديو عشوائي من مجموعة فيديوهات + ردة فعل ⚽ لأي حد.',
  category: 'edit',

  async execute(sock, msg) {
    try {
      const chatJid = msg.key.remoteJid;

      // رسالة البداية
      await sock.sendMessage(chatJid, {
        text: `🎬 فيديو عشوائي قادم، خليك متابع ⚽`,
      });

      // اختيار فيديو عشوائي
      const randomVideo = dir[Math.floor(Math.random() * dir.length)];

      // إرسال الفيديو
      const videoMsg = await sock.sendMessage(chatJid, {
        video: { url: randomVideo },
        caption: '🥳 استمتع بالفيديو!',
      }, { quoted: msg });

      // إضافة ردة فعل ⚽
      await sock.sendMessage(chatJid, { 
        react: { text: '⚽', key: videoMsg.key } 
      });

    } catch (err) {
      console.error('خطأ في أمر الدون:', err);
      await sock.sendMessage(msg.key.remoteJid, { text: '⚠ حصل خطأ غير متوقع.' }, { quoted: msg });
    }
  }
};