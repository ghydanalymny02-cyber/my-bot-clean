const fs = require('fs');
const { eliteNumbers, extractPureNumber } = require('../haykala/elite');
const path = './spam-status.json';

module.exports = {
  command: 'اسبام',
  description: '📢 يكرر رسالة بعدد معين / تشغيل أو إيقاف السبام (للمطور فقط)',
  usage: '.اسبام [كلمة] [عدد] | .اسبام غلق | .اسبام فتح',
  category: 'tools',

  async execute(sock, msg) {
    const senderJid = msg.key.participant || msg.key.remoteJid;
    const senderNumber = extractPureNumber(senderJid);
    const chatId = msg.key.remoteJid;

    // استخراج نص الرسالة بعد .اسبام
    const body =
      msg.message?.conversation ||
      msg.message?.extendedTextMessage?.text ||
      '';

    const args = body.split(' ').slice(1); // نشيل كلمة .اسبام من الأول

    // تحميل حالة السبام
    let status = { enabled: true };
    if (fs.existsSync(path)) {
      status = JSON.parse(fs.readFileSync(path));
    }

    const input = args.join(' ').toLowerCase();

    // أوامر المطور: غلق أو فتح
    if (input === 'غلق' || input === 'فتح') {
      if (!eliteNumbers.includes(senderNumber)) {
        return sock.sendMessage(chatId, {
          text: '🚫 الأمر ده للمطور أو النخبة بس يا معلم!'
        }, { quoted: msg });
      }

      status.enabled = input === 'فتح';
      fs.writeFileSync(path, JSON.stringify(status));

      return sock.sendMessage(chatId, {
        text: status.enabled
          ? '✅ تم *تشغيل* السبام بنجاح.'
          : '🚫 تم *إيقاف* السبام مؤقتًا.',
      }, { quoted: msg });
    }

    // لو السبام مقفول
    if (!status.enabled) {
      return sock.sendMessage(chatId, {
        text: '🚫 أمر السبام مقفول دلوقتي بواسطة المطور.',
      }, { quoted: msg });
    }

    // الاستخدام العادي
    if (args.length < 2) {
      return sock.sendMessage(chatId, {
        text: '❌ استخدم الأمر كده:\n.اسبام احمد 10',
      }, { quoted: msg });
    }

    const repeatCount = parseInt(args[args.length - 1]);
    const text = args.slice(0, -1).join(' ');

    if (isNaN(repeatCount) || repeatCount < 1) {
      return sock.sendMessage(chatId, {
        text: '❌ لازم تكتب عدد صحيح أكبر من 0',
      }, { quoted: msg });
    }

    if (repeatCount > 50) {
      return sock.sendMessage(chatId, {
        text: '🚫 الحد الأقصى هو 50 رسالة بس يا فخم عشان البوت ميضربش 💀',
      }, { quoted: msg });
    }

    for (let i = 0; i < repeatCount; i++) {
      await sock.sendMessage(chatId, { text });
    }
  }
};