const os = require('os');

module.exports = {
  command: 'مسرع',
  description: '⚡ اختبار سرعة البوت ومدة تشغيله بدقة',
  usage: '.مسرع',
  category: 'tools',

  async execute(sock, msg) {
    try {
      const jid = msg?.key?.remoteJid || msg?.from;
      if (!jid) return console.warn('❌ لا يوجد remoteJid للإرسال');

      // قياس سرعة الاستجابة (Ping)
      const start = Date.now();
      try { await sock.sendPresenceUpdate('composing', jid); } catch {}
      const ping = Date.now() - start;

      // مدة التشغيل (uptime) من النظام نفسه
      const uptimeSec = process.uptime();
      const days = Math.floor(uptimeSec / (60 * 60 * 24));
      const hours = Math.floor((uptimeSec % (60 * 60 * 24)) / (60 * 60));
      const minutes = Math.floor((uptimeSec % (60 * 60)) / 60);
      const seconds = Math.floor(uptimeSec % 60);

      const uptime = `${days ? days + 'd ' : ''}${hours}h ${minutes}m ${seconds}s`;

      // جلب صورة البوت أو استخدام الافتراضية
      let botProfilePic = 'https://i.imgur.com/8TnZ4Rv.png';
      try {
        if (sock.user?.id) {
          const url = await sock.profilePictureUrl(sock.user.id, 'image').catch(() => null);
          if (url) botProfilePic = url;
        }
      } catch {}

      // 📦 نص منسق
      const decoratedText = `
❄ *مـــجـــهـــول⊰𝑩𝑶𝑻* ❄

✅ جاهز للاستعمال تمامًا
⚜️ *الاستجابة:* ${ping}ms
⏱️ *المدة:* ${uptime}
💻 *النظام:* ${os.type()} ${os.arch()}
`.trim();

      // 🚀 إرسال الرد المنسق مع externalAdReply
      await sock.sendMessage(jid, {
        text: decoratedText,
        mentions: msg?.sender ? [msg.sender] : [],
        contextInfo: {
          externalAdReply: {
            title: "❄ 𝒀𝑼𝑴𝑰𝑳𝑨 𝑩𝑶𝑻 ❄",
            body: `⚜️ سرعة: ${ping}ms | ⏱️ تشغيل: ${uptime}`,
            thumbnailUrl: botProfilePic,
            sourceUrl: 'https://wa.me/963996097873',
            mediaType: 1,
            renderLargerThumbnail: true
          }
        }
      }, { quoted: msg });

    } catch (error) {
      console.error('❌ خطأ في أمر مسرع:', error);
      await sock.sendMessage(msg?.key?.remoteJid || msg?.from || '', {
        text: `⚠️ حدث خطأ أثناء تنفيذ الأمر.\n\n📄 التفاصيل: ${error?.message || error?.toString() || 'Unknown error'}`,
      }, { quoted: msg });
    }
  }
};