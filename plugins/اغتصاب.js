const fs = require('fs');

module.exports = {
  command: 'اغتصبيهم',
  description: 'يرسل إعلان دمار شامل بصوت وصورة مع عد تنازلي',
  usage: '.دمار',

  async execute(sock, msg) {
    const jid = msg.key.remoteJid;

    let groupName = 'هذا الجروب';
    try {
      const metadata = await sock.groupMetadata(jid);
      groupName = metadata.subject || groupName;
    } catch (e) {
      console.log('⚠️ فشل في جلب اسم الجروب:', e.message);
    }

    const text = `💥 *إعلان سيتم اغتصاب كل اعضاء*
الجروب *${groupName}*سيتألمون ويبكون ويصرخون*الألم في اعينهم*!
هم يبكون بسبب حضهم 
*اغتصاب لا يرحم... كل شيء سيغتصب!*`;

    const imagePath = '/storage/emulated/0/king/bot/resources/war.jpg';
    const audioPath = '/storage/emulated/0/king/bot/resources/war2.mp3';

    try {
      const imageBuffer = fs.readFileSync(imagePath);
      const audioBuffer = fs.readFileSync(audioPath);

      // 🔊 رسالة تمهيدية
      await sock.sendMessage(jid, {
        text: `🚨 *جاري اغتصاب الجروب...*`,
      }, { quoted: msg });

      // ⏱️ العد التنازلي
      await new Promise(resolve => setTimeout(resolve, 1000));
      await sock.sendMessage(jid, { text: '3️⃣', }, { quoted: msg });
      await new Promise(resolve => setTimeout(resolve, 1000));
      await sock.sendMessage(jid, { text: '2️⃣', }, { quoted: msg });
      await new Promise(resolve => setTimeout(resolve, 1000));
      await sock.sendMessage(jid, { text: '1️⃣', }, { quoted: msg });

      // 🖼️ إرسال الصورة
      await sock.sendMessage(jid, {
        image: imageBuffer,
        caption: text,
      }, { quoted: msg });

      // 🔊 إرسال الصوت
      await sock.sendMessage(jid, {
        audio: audioBuffer,
        mimetype: 'audio/mpeg',
        ptt: false,
      }, { quoted: msg });

    } catch (err) {
      console.error('❌ في خطأ في أمر الاغتصاب:', err);
      await sock.sendMessage(jid, {
        text: '❌ حصل خطأ أثناء تنفيذ أمر الاغتصاب.',
      }, { quoted: msg });
    }
  },
};