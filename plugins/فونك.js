const axios = require('axios');
const { proto } = require('@whiskeysockets/baileys');

module.exports = {
  command: ['فونك'],
  description: '🎧 يبعتلك أغنية بونك حماسية عشوائية مع زر "التالي".',
  category: 'fun',

  async execute(sock, msg) {
    const audioLinks = [
      'https://files.catbox.moe/xqx3tu.mp3',
      'https://files.catbox.moe/dwz3mx.mp3',
      'https://files.catbox.moe/7u1g5h.mp3',
      'https://files.catbox.moe/w30b09.mp3',
      'https://files.catbox.moe/2u8vdx.mp3',
      'https://files.catbox.moe/b3of7z.mp3',
      'https://files.catbox.moe/3k7dcy.mp3',
      'https://files.catbox.moe/1tdk8a.mp3',
      'https://files.catbox.moe/dxqt5m.mp3',
      'https://files.catbox.moe/ixik57.mp3',
      'https://files.catbox.moe/ujxut7.mp3',
      'https://files.catbox.moe/vvwe44.mp3',
      'https://files.catbox.moe/w84vci.mp3',
      'https://files.catbox.moe/zqylht.mp3',
      'https://files.catbox.moe/l44mgl.mp3',
      'https://files.catbox.moe/h5rzzf.mp3',
      'https://files.catbox.moe/wuh2q5.mp3',
      'https://files.catbox.moe/k3srmq.mp3',
      'https://files.catbox.moe/b7k99o.mp3',
      'https://files.catbox.moe/oql7qk.mp3'
    ];

    const randomUrl = audioLinks[Math.floor(Math.random() * audioLinks.length)];

    try {
      // ⏳ رسالة انتظار
      const waitingMsg = await sock.sendMessage(msg.key.remoteJid, {
        text: '⏳ انتظر قليلاً جاري تشغيل الحماس...',
      }, { quoted: msg });

      // تحميل الصوت
      const { data } = await axios.get(randomUrl, {
        responseType: 'arraybuffer',
        headers: {
          'User-Agent': 'Mozilla/5.0'
        }
      });

      // إرسال الصوت مع زر
      await sock.sendMessage(msg.key.remoteJid, {
        audio: Buffer.from(data),
        mimetype: 'audio/mp4',
        ptt: false,
        caption: '🔥 اضغط التالي لو عايز حماس أكتر!',
        buttons: [
          {
            buttonId: 'حماس',
            buttonText: { displayText: '🎵 التالي' },
            type: 1,
          },
        ],
      }, { quoted: waitingMsg });

    } catch (err) {
      console.error('❌ فشل تحميل الصوت:', err.message);
      await sock.sendMessage(msg.key.remoteJid, {
        text: '❌ فشل تحميل الصوت. جرب مرة تانية.',
      }, { quoted: msg });
    }
  }
};