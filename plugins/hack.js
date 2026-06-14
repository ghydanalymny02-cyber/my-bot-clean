// دالة داخلية سريعة لجلب اسم الدولة والعاصمة بناءً على كود الرقم الصادر من الواتساب
function getCountryDetails(phoneNumber) {
  // فحص بداية الرقم لتحديد الدولة والعاصمة
  if (phoneNumber.startsWith('967')) {
    return { name: 'اليمن', capital: 'صنعاء', lang: 'العربية' };
  } else if (phoneNumber.startsWith('212')) {
    return { name: 'المغرب', capital: 'الرباط', lang: 'الفرنسية / العربية' };
  } else if (phoneNumber.startsWith('20')) {
    return { name: 'مصر', capital: 'القاهرة', lang: 'العربية' };
  } else if (phoneNumber.startsWith('966')) {
    return { name: 'المملكة العربية السعودية', capital: 'الرياض', lang: 'العربية' };
  } else if (phoneNumber.startsWith('971')) {
    return { name: 'الإمارات العربية المتحدة', capital: 'أبوظبي', lang: 'العربية' };
  } else if (phoneNumber.startsWith('964')) {
    return { name: 'العراق', capital: 'بغداد', lang: 'العربية' };
  } else if (phoneNumber.startsWith('213')) {
    return { name: 'الجزائر', capital: 'الجزائر', lang: 'الفرنسية / العربية' };
  } else if (phoneNumber.startsWith('1')) {
    return { name: 'الولايات المتحدة', capital: 'واشنطن', lang: 'الإنجليزية' };
  } else if (phoneNumber.startsWith('33')) {
    return { name: 'فرنسا', capital: 'باريس', lang: 'الفرنسية' };
  }

  // افتراضي إذا لم تكن الدولة مسجلة فوق
  return { name: 'دولة عربية', capital: 'غير معروفة', lang: 'العربية' };
}

module.exports = {
  command: ['هكرو', 'تهكير'],
  category: 'fun',
  description: 'يُظهر معلومات الجهاز للمستخدم المشار إليه "مجرد مزحة"',
  usage: '.هكرو [منشن الشخص]',

  async execute(sock, msg, args) {
    try {
      // جلب الرقم المذكور (منشن) المتوافق مع الهاندلر
      const mentionedJid = msg.message?.extendedTextMessage?.contextInfo?.mentionedJid?.[0];
      const from = msg.key.remoteJid;

      if (!mentionedJid) {
        return await sock.sendMessage(from, {
          text: "❌ يرجى منشنة الشخص للحصول على معلوماته.",
        }, { quoted: msg });
      }

      const phoneNumber = mentionedJid.split('@')[0];
      
      // جلب بيانات الدولة من الدالة الداخلية مباشرة بدون مكتبات خارجية
      const details = getCountryDetails(phoneNumber);

      const generateRandomIpSegment = () => Math.floor(Math.random() * 256);
      const ip = `192.168.${generateRandomIpSegment()}.${generateRandomIpSegment()}`;

      // إرسال الرسالة الأولى وتخزينها لتعديلها لاحقاً
      const countdownMessage = await sock.sendMessage(from, {
        text: "⏳ **[جارِ اختراق الهدف...]**\n- يتم الآن فحص الثغرات المتاحة...",
      }, { quoted: msg });

      const lines = [
        `\n🔍 **[تم سحب بيانات الجهاز بنجاح]**`,
        `-----------------------------`,
        `📱 **نوع الجهاز:** Android / iOS`,
        `🔋 **حالة البطارية:** 74% (يتم الشحن)`,
        `🌐 **عنوان الـIP:** ${ip}`,
        `📡 **الموقع:** ${details.name} - ${details.capital}`,
        `🌍 **لغة الجهاز:** ${details.lang}`,
        `⚙️ **مواصفات إضافية:**`,
        `🧠 **المعالج:** Snapdragon 8 Gen 2`,
        `💾 **الرام:** 8GB`,
        `📸 **الكاميرا:** 108MP`,
        `📲 **رقم IMEI:** 357462081******`,
        `📡 **MAC Address:** 00:1A:79:00:34:BC`,
        `🌐 **DNS Server:** 8.8.8.8`,
        `📤 **آخر نشاط:**`,
        `- تم اختراق الكاميرا الأمامية بنجاح 📸`,
        `- جاري رفع الصور والمحادثات للسيرفر.. 🚀`,
        `-----------------------------`,
        `⚠️ **مزحة:** الكود للمزاح فقط، لا توجد أي عملية اختراق حقيقية! 😉`
      ];

      let currentMessage = "⏳ **[جارِ اختراق الهدف...]**\n- يتم الآن فحص الثغرات المتاحة...";
      let index = 0;

      const interval = setInterval(async () => {
        if (index < lines.length) {
          currentMessage += `\n${lines[index]}`;
          
          // تعديل الرسالة في Baileys بأمان
          await sock.sendMessage(from, {
            text: currentMessage,
            edit: countdownMessage.key
          }).catch(() => {});
          
          index++;
        } else {
          clearInterval(interval);
        }
      }, 1000); 

    } catch (error) {
      console.error("خطأ في أمر التهكير:", error);
      if (msg && msg.key && msg.key.remoteJid) {
        await sock.sendMessage(msg.key.remoteJid, {
          text: "❌ حدث خطأ غير متوقع أثناء تشغيل أمر التهكير.",
        }).catch(() => {});
      }
    }
  },
};

