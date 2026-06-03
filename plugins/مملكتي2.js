// *حقوق مطور يوميلا 🛡*
// 📄 مملكتي2.js

const fs = require('fs');
const { join } = require('path');

module.exports = {
  command: ['مملكتي2'],
  description: 'مدح لمملكة يوميلا + عرض أرقام النخبة والمطور من مصدر خارجي',
  category: 'ترفيه',

  async execute(sock, msg) {
    const jid = msg.key.remoteJid;

    // **مسار ملف النخبة** (عدّله حسب تنظيمك)
    const elitePath = join('/storage/emulated/0/bot/data/', 'elite.json');

    // **رقم المطور** (أرقامه الظاهرة في الرسالة)
    const developerNumber = '963996097873';

    try {
      // قراءة ملف النخبة
      let eliteNumbers = [];
      if (fs.existsSync(elitePath)) {
        const raw = fs.readFileSync(elitePath, 'utf-8');
        const data = JSON.parse(raw);
        eliteNumbers = Array.isArray(data.numbers) ? data.numbers : [];
      }

      // تنظيف الأرقام: إبقاء أرقام بدون + وبدون مسافات
      eliteNumbers = eliteNumbers
        .map(n => String(n).replace(/[^\d]/g, ''))
        .filter(n => n.length >= 9);

      // إن لم توجد أرقام نخبة في الملف، استخدم قائمة افتراضية كي لا تفشل الرسالة
      if (eliteNumbers.length === 0) {
        eliteNumbers = [developerNumber]; // تضمين المطور كحد أدنى
      }

      // تحقّق اختياري عبر onWhatsApp: يحتاج أرقام خام، وليس JID
      let resolvedElite = [];
      try {
        const result = await sock.onWhatsApp(eliteNumbers);
        resolvedElite = (result || [])
          .filter(r => r.exists)
          .map(r => r.jid.replace('@s.whatsapp.net', '')); // نعرض الرقم صافي
      } catch {
        // في حال فشل التحقق، نعرض القائمة كما هي
        resolvedElite = eliteNumbers;
      }

      // صياغة النص المزخرف
      const text = `
👑 مملكة ♜𝒀𝑼𝑴𝑰𝑳𝑨 𝑩𝒐𝒕꧂ 👑
━━━━━━━━━━━━━━━━━━
⚔️ أسطورة القوة والهيبة
🔥 رمز العظمة والخلود
🌌 فخر العشيرة والمجموعة
━━━━━━━━━━━━━━━━━━
📞 أرقام النخبة:
${resolvedElite.map(n => `- +${n}`).join('\n')}
━━━━━━━━━━━━━━━━━━
👑 المطور: يوميلا
📞 رقم المطور: +${developerNumber}
━━━━━━━━━━━━━━━━━━
`.trim();

      await sock.sendMessage(jid, { text }, { quoted: msg });

    } catch (err) {
      console.error('❌ خطأ في مملكتي2:', err);
      await sock.sendMessage(jid, {
        text: '❌ حصل خطأ أثناء جلب أرقام النخبة. تأكد من elite.json وصيغة الأرقام (بدون مسافات أو رموز).'
      }, { quoted: msg });
    }
  }
};