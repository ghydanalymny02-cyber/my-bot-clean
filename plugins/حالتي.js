// commands/حالتي.js
const fs = require('fs');
const path = require('path');

module.exports = {
  command: 'حالتي',
  category: 'tools',
  description: 'يعرفك إذا كنت متبند ولا لا',
  usage: '.حالتي',

  async execute(sock, msg, args) {
    try {
      const bannedPath = path.join(__dirname, '../data/banned.json');
      let bannedNumbers = [];
      if (fs.existsSync(bannedPath)) {
        bannedNumbers = JSON.parse(fs.readFileSync(bannedPath, 'utf8')) || [];
      }

      // استخراج رقم المرسل (من group أو من الخاص)
      const jid = msg.key.participant || msg.key.remoteJid || '';
      const senderNumber = jid.split('@')[0];

      if (bannedNumbers.includes(senderNumber)) {
        // نفس رسالة البان في الهاندلر
        const text = `🚫 حسابك متبند من استخدام البوت.\n\n✅ لكن تقدر تستخدم أمر واحد بس وهو *.حالتي* عشان تعرض حالتك.\n\nلو عايز تفك البان اتواصل مع المطور:\nhttps://wa.me/967 733 032 858?text=لو+سمحت+شيل+البان+عن+رقمي.`;
        await sock.sendMessage(msg.key.remoteJid, { text }, { quoted: msg });
        return;
      }

      // لو مش متبند — ردود فكاهية عشوائية
      const funnyReplies = [
        "✅ حالتك: إنت زي الفل ومش متبند 🎉\n\n🤖 البوت: *عيش حياتك يا نجم ومتخليش حد يعملك بان خخخخخ*",
        "✅ حالتك: السما رايقة وانت مش متبند 🌞\n\n😂 البوت: *ابقى حلو وخلي بالك بس من الستات وخخخخخ*",
        "✅ حالتك: تمام التمام 👌\n\n🤖 البوت: *عاش يا بطل، انت حر طليق مش متبند 😎 خخخخخ*"
      ];
      const reply = funnyReplies[Math.floor(Math.random() * funnyReplies.length)];
      await sock.sendMessage(msg.key.remoteJid, { text: reply }, { quoted: msg });
    } catch (err) {
      console.error('❌ خطأ في أمر حالتي:', err);
      await sock.sendMessage(msg.key.remoteJid, { text: '❌ حصل خطأ في التحقق من حالتك، جرّب تاني.' }, { quoted: msg });
    }
  }
};
