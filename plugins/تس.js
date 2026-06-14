module.exports = {
  command: 'تس',
  description: 'عرض حالة البوت المزخرفة 🔥',
  usage: '.تست',
  category: 'tools',

  async execute(sock, msg) {
    try {
      // 🌨️ إرسال رسالة "جاري الاختبار" مزخرفة بالثلج
      await sock.sendMessage(
        msg.key.remoteJid,
        { text: '*بوت مـــجـــهـــول جاهزه ❄ 🕸*' },
        { quoted: msg }
      );

      // وقت البدء لقياس سرعة الاستجابة
      const start = performance.now();

      // اختبار بسيط للتأكد من اتصال البوت
      await sock.sendPresenceUpdate('composing', msg.key.remoteJid);

      // حساب سرعة الاستجابة
      const ping = (performance.now() - start).toFixed(2);

      // جلب صورة البوت أو استخدام صورة افتراضية
      let botProfilePic = 'https://i.imgur.com/8TnZ4Rv.png';
      try {
        if (sock.user?.id) {
          botProfilePic = await sock.profilePictureUrl(sock.user.id, 'image');
        }
      } catch {}

      // التاريخ والوقت بالعربية
      const now = new Date();
      const arabicDate = now.toLocaleDateString('ar-EG', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
      const arabicTime = now.toLocaleTimeString('ar-EG', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
      });

      // 💠 الرسالة المزخرفة النهائية
      const messageText = `
*╭─🇾🇪『 ❄ مـــجـــهـــول  𝑩𝒐𝒕꧂ 』🇾🇪─╮*
🤖 𝑩𝑶𝑻 : ❄ مـــجـــهـــول 𝒐 𝑩𝒐𝒕꧂  
⚡ سـرعـة الاسـتـجـابـة : ${ping} 𝑴𝑺  
📅 الـتـاريـخ : ${arabicDate}  
🕒 الـوقـت : ${arabicTime}  
🧠 الـمطـور : مـــجـــهـــول❄
ـ-ـ-ـ-ـ-ـ-ـ-ـ-ـ-ـ-ـ-ـ-ـ-ـ-ـ-ـ-ـ-ـ-ـ-ـ  
🔋 𝑷𝑶𝑾𝑬𝑹𝑬𝑫 𝑩𝒀 مـــجـــهـــول 𝑩𝑶𝑻  
*╯──────────────╰*
`.trim();

      // إرسال الرسالة المزخرفة مع externalAdReply الجميل
      const message = {
        text: messageText,
        contextInfo: {
          externalAdReply: {
            title: "⚡ ♜مـــجـــهـــول 𝑩𝒐𝒕 𝑶𝑵𝑳𝑰𝑵𝑬 ⚡",
            body: `⚙️ الاسـتـجـابـة : ${ping} 𝑴𝑺`,
            thumbnailUrl: botProfilePic,
            sourceUrl: 'https://wa.me/963996097873',
            mediaType: 1,
            renderLargerThumbnail: true
          }
        }
      };

      await new Promise(resolve => setTimeout(resolve, 1000)); // انتظار بسيط قبل النتيجة
      await sock.sendMessage(msg.key.remoteJid, message, { quoted: msg });

    } catch (error) {
      console.error('❌ Test Command Error:', error);
      await sock.sendMessage(
        msg.key.remoteJid,
        { text: '⚠️ حدث خطأ أثناء تنفيذ الأمر. حاول مجددًا بعد قليل.' },
        { quoted: msg }
      );
    }
  }
};