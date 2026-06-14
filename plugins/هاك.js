module.exports = {
  command: "هاك",
  description: "مزحة تهكير واقعية جدًا للضحك",
  category: 'ترفيه',
  usage: ".هكر [رقم أو منشن]",
  async execute(sock, msg) {
    try {
      let target = msg.key.remoteJid;
      let targetNumber = (msg.key.participant || msg.key.remoteJid).split('@')[0];

      if (msg.mentionedJid?.length > 0) {
        target = msg.mentionedJid[0];
        targetNumber = target.split('@')[0];
      } else if (msg.args?.[0]) {
        let input = msg.args[0].trim();
        if (/^\d+$/.test(input)) {
          targetNumber = input;
          target = `${input}@s.whatsapp.net`;
        } else if (input.endsWith('@s.whatsapp.net')) {
          target = input;
          targetNumber = input.split('@')[0];
        }
      }

      const send = async (text, delay = 1200) => {
        return new Promise(resolve => {
          setTimeout(async () => {
            await sock.sendMessage(msg.key.remoteJid, { text }, { quoted: msg });
            resolve();
          }, delay);
        });
      };

      await send(`☠️ جاري اختراق الهدف: +${targetNumber}`);
      await send(`📶 الاتصال بسيرفرات NSA...`);
      await send(`🔍 استخراج ملفات التجسس...`);
      await send(`💾 تنزيل قاعدة بيانات: passwords.txt`);
      await send(`📤 إرسال المعلومات إلى السيرفر المظلم...`);
      await send(`✅ تم اختراق +${targetNumber} بنجاح!`);
      await send(`اسم الضحيه:محمد شريف احمد السوهاجي`);

    } catch (err) {
      console.error("Hacker command error:", err);
      await sock.sendMessage(msg.key.remoteJid, {
        text: "❌ حصل خطأ أثناء تنفيذ التهكير. جرب تاني."
      });
    }
  }
};