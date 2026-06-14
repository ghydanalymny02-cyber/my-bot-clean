/**
 * 📄 مطور.js
 * 👑 أمر عرض معلومات المطور
 * 🎯 إصدار: 2.0.0
 * 📅 آخر تحديث: 2024
 */

const developerConfig = {
  // معلومات المطور الأساسية
  personalInfo: {
    name: "𓆩 ♜مــجــهــول||𝕲𝕳𝕰𝕯𝕬𝕹  𓆪",
    alias: "『 ♜مــجــهــول||𝕲𝕳𝕰𝕯𝕬𝕹 』⚔️",
    age: 14,
    birthYear: 1430,
    quote: "𝐄𝐋 𝐏𝐀𝐓𝐑Ó𝐍 𝐃𝐄𝐋 𝐌𝐀𝐋🕶️",
    hobby: "Programming 👨‍💻",
    specialization: "Node.js | WhatsApp Bots",
    experience: "3 سنوات"
  },

  // معلومات الاتصال
  contactInfo: {
    phone: "+967 715 677 073",
    whatsapp: "+967715677073",
    countryCode: "963",
    country: "اليمن 🇾🇪",
    city: "ذمار",
    timezone: "UTC+3"
  },

  // معلومات العمل
  workInfo: {
    company: "『 ♜مــجــهــول||𝕲𝕳𝕰𝕯𝕬𝕹 ｼ 』 Bot",
    position: "مطور رئيسي",
    projects: "10+ مشروع",
    status: "متاح للعمل الحر",
    availability: "24/7 دعم فني"
  },

  // روابط التواصل
  socialLinks: {
    whatsapp: "https://wa.me/967715677073",
    telegram: "@ShadowDev",
    github: "github.com/ShadowCoder",
    portfolio: "shadow-portfolio.com"
  },

  // إعدادات البوت
  botInfo: {
    name: "『 ♜مــجــهــول||𝕲𝕳𝕰𝕯𝕬𝕹 ｼ 』 Bot",
    version: "2.0.0",
    language: "JavaScript/Node.js",
    framework: "Baileys",
    uptime: "99.8%"
  }
};

// نظام التخزين المؤقت
const rateLimitCache = new Map();
const RATE_LIMIT_TIME = 30000; // 30 ثانية

// فحص صحة الأرقام
function validatePhoneNumber(phone) {
  const phoneRegex = /^\+[1-9]\d{1,14}$/;
  return phoneRegex.test(phone.replace(/\s/g, ''));
}

// إنشاء vCard
function createVCard() {
  const { personalInfo, contactInfo } = developerConfig;
  
  return `BEGIN:VCARD
VERSION:3.0
FN:${personalInfo.name}
N:${personalInfo.alias};;;;
TITLE:${personalInfo.specialization}
TEL;TYPE=CELL,VOICE:${contactInfo.phone.replace(/\s/g, '')}
ADR;TYPE=WORK:;;${contactInfo.city};${contactInfo.country};;;
EMAIL:shadow.dev@email.com
URL:${developerConfig.socialLinks.whatsapp}
NOTE:مطور بوتات واتساب محترف - ${personalInfo.quote}
X-SOCIALPROFILE;TYPE=github:${developerConfig.socialLinks.github}
REV:${new Date().toISOString()}
END:VCARD`.trim();
}

// إنشاء الرسالة الرئيسية
function createMainMessage() {
  const { personalInfo, contactInfo, workInfo, botInfo } = developerConfig;
  
  return `
╔════════════════════════════════╗
║      👑 بطاقة المطور الرسمية 👑     ║
╚════════════════════════════════╝

┌─【📊 المعلومات الشخصية】─┐
│ • الاسم: ${personalInfo.name}
│ • اللقب: ${personalInfo.alias}
│ • العمر: ${personalInfo.age} سنة
│ • الميلاد: ${personalInfo.birthYear} هـ
│ • الهواية: ${personalInfo.hobby}
│ • التخصص: ${personalInfo.specialization}
│ • الخبرة: ${personalInfo.experience}
│ • الشعار: "${personalInfo.quote}"
└─────────────────────┘

┌─【📞 معلومات الاتصال】─┐
│ • الهاتف: ${contactInfo.phone}
│ • البلد: ${contactInfo.country}
│ • المدينة: ${contactInfo.city}
│ • المنطقة الزمنية: ${contactInfo.timezone}
└─────────────────────┘

┌─【💼 معلومات العمل】─┐
│ • الشركة: ${workInfo.company}
│ • المنصب: ${workInfo.position}
│ • المشاريع: ${workInfo.projects}
│ • الحالة: ${workInfo.status}
│ • الدعم: ${workInfo.availability}
└─────────────────────┘

┌─【🤖 معلومات البوت】─┐
│ • الإصدار: ${botInfo.version}
│ • اللغة: ${botInfo.language}
│ • الإطار: ${botInfo.framework}
│ • الوقت التشغيلي: ${botInfo.uptime}
└─────────────────────┘

🔗 *للتواصل السريع:*
${developerConfig.socialLinks.whatsapp}?text=مرحبًا+${personalInfo.name}+أحتاج+مساعدتك

📌 *ملاحظة:* هذا الرقم ليس بوتًا، يرجى عدم إرسال الأوامر
`.trim();
}

// إنشاء رسالة التعليمات
function createInstructionsMessage() {
  return `
┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
┃        📋 بروتوكول التواصل        ┃
┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛

✅ *قواعد يجب اتباعها:*
1️⃣ تواصل للأمور المهمة فقط
2️⃣ اذكر اسمك والغرض من التواصل
3️⃣ أرسل جميع متطلباتك في رسالة واحدة
4️⃣ تجنب الرسائل المتكررة
5️⃣ لا ترسل أي أوامر بوت

❌ *ما يؤدي للحظر فورًا:*
✗ رسائل السبام
✗ مكالمات بدون ترتيب
✗ إرسال أوامر بوت
✗ انتهاك الخصوصية

⏰ *أوقات الاستجابة:*
• الدعم الفني: خلال 24 ساعة
• المشاريع: خلال 48 ساعة
• الاستشارات: حسب الموعد

📞 *طرق التواصل المفضلة:*
1. واتساب (للأمور العاجلة)
2. تيليجرام (للمشاريع)
3. البريد الإلكتروني (للعروض)

شكرًا لتفهمك وتعاونك 🤝
`.trim();
}

// إنشاء رسالة الوسائط (إن وجدت)
function createMediaMessage() {
  return {
    text: `🎬 *محتوى إضافي*

📁 *مشاريع سابقة:*
• نظام إدارة بوتات متكامل
• منصة دردشة ذكية
• نظام حجوزات متقدم
• أدوات أتمتة متعددة

🛠️ *الخدمات المقدمة:*
✓ تطوير بوتات واتساب
✓ أنظمة إدارة محتوى
✓ حلول الأتمتة
✓ استشارات تقنية

💰 *نموذج التسعير:*
• مشاريع صغيرة: 50-100$
• مشاريع متوسطة: 100-300$
• مشاريع كبيرة: 300+$
• صيانة شهرية: 20-50$

📊 *معدل إنجاز المشاريع:*
• التسليم في الوقت: 95%
• رضا العملاء: 98%
• إعادة العمل: 2%

للحصول على عرض سعر، راسلني مع تفاصيل مشروعك 📈`,
    
    // يمكن إضافة صورة أو ملف هنا
    image: null, // { url: 'https://example.com/image.jpg' }
    document: null // { url: 'https://example.com/portfolio.pdf', fileName: 'Portfolio.pdf' }
  };
}

// التحقق من التخزين المؤقت
function checkRateLimit(from) {
  const cacheKey = `developer_${from}`;
  
  if (rateLimitCache.has(cacheKey)) {
    const lastRequest = rateLimitCache.get(cacheKey);
    const timePassed = Date.now() - lastRequest;
    
    if (timePassed < RATE_LIMIT_TIME) {
      const remainingTime = Math.ceil((RATE_LIMIT_TIME - timePassed) / 1000);
      return {
        limited: true,
        remainingTime,
        message: `⏳ يرجى الانتظار ${remainingTime} ثانية قبل استخدام الأمر مرة أخرى`
      };
    }
  }
  
  rateLimitCache.set(cacheKey, Date.now());
  return { limited: false };
}

// تنظيف التخزين المؤقت القديم
setInterval(() => {
  const now = Date.now();
  for (const [key, timestamp] of rateLimitCache.entries()) {
    if (now - timestamp > RATE_LIMIT_TIME * 10) {
      rateLimitCache.delete(key);
    }
  }
}, 60000); // كل دقيقة

module.exports = {
  name: 'مطور',
  command: ['مطور'],
  category: 'معلومات',
  description: '👑 عرض معلومات المطور والاتصال به',
  usage: 'مجرد اكتب "مطور"',
  cooldown: 30, // ثانية
  hidden: false,
  premium: false,
  adminOnly: false,
  
  async execute(sock, msg, args) {
    try {
      const from = msg.key.remoteJid;
      const sender = msg.key.participant || from;
      
      // التحقق من التخزين المؤقت
      const rateLimit = checkRateLimit(sender);
      if (rateLimit.limited) {
        await sock.sendMessage(from, {
          text: rateLimit.message
        }, { quoted: msg });
        return;
      }
      
      // التحقق من صحة رقم الواتساب
      if (!validatePhoneNumber(developerConfig.contactInfo.whatsapp)) {
        console.warn('⚠️ رقم الواتساب غير صالح في الإعدادات');
      }
      
      // إرسال رسالة الانتظار
      await sock.sendMessage(from, {
        text: '📡 جاري تحميل معلومات المطور...'
      });
      
      // 1. إرسال الرسالة الرئيسية
      const mainMessage = createMainMessage();
      await sock.sendMessage(from, {
        text: mainMessage,
        contextInfo: {
          mentionedJid: [developerConfig.contactInfo.whatsapp + '@s.whatsapp.net']
        }
      }, { quoted: msg });
      
      // تأخير بسيط
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // 2. إرسال جهة الاتصال (vCard)
      const vcard = createVCard();
      await sock.sendMessage(from, {
        contacts: {
          displayName: developerConfig.personalInfo.name,
          contacts: [{ vcard }]
        }
      });
      
      // تأخير بسيط
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // 3. إرسال تعليمات التواصل
      const instructionsMessage = createInstructionsMessage();
      await sock.sendMessage(from, {
        text: instructionsMessage
      });
      
      // 4. إرسال محتوى إضافي (اختياري)
      const mediaMessage = createMediaMessage();
      if (mediaMessage.image || mediaMessage.document) {
        await new Promise(resolve => setTimeout(resolve, 800));
        
        const mediaOptions = {};
        if (mediaMessage.image) {
          mediaOptions.image = mediaMessage.image;
        }
        if (mediaMessage.document) {
          mediaOptions.document = mediaMessage.document;
          mediaOptions.mimetype = 'application/pdf';
          mediaOptions.fileName = 'Portfolio_Shadow.pdf';
        }
        
        if (Object.keys(mediaOptions).length > 0) {
          await sock.sendMessage(from, {
            ...mediaOptions,
            caption: mediaMessage.text
          });
        } else {
          await sock.sendMessage(from, {
            text: mediaMessage.text
          });
        }
      }
      
      // 5. رسالة تأكيد إضافية
      await new Promise(resolve => setTimeout(resolve, 500));
      await sock.sendMessage(from, {
        text: `✅ تم إرسال جميع المعلومات بنجاح!

📊 *ملخص الإرسال:*
• الرسالة الرئيسية ✓
• جهة الاتصال ✓
• التعليمات ✓
${mediaMessage.image || mediaMessage.document ? '• المحتوى الإضافي ✓' : ''}

🔔 *تذكير:* يمكنك استخدام:
• "مطور" لعرض هذه المعلومات
• "مساعدة" لعرض جميع الأوامر
• "حول" لمعلومات البوت

شكرًا لاستخدامك البوت! 🚀`
      });
      
      // تسجيل الاستخدام
      console.log(`📨 تم عرض معلومات المطور لـ: ${sender}`);
      
    } catch (error) {
      console.error('❌ خطأ في أمر المطور:', error);
      
      // رسائل خطأ مخصصة
      const errorMessages = {
        'ENOTFOUND': '❌ خطأ في الاتصال بالإنترنت',
        'ETIMEDOUT': '⏰ انتهت مهلة الاتصال',
        'ECONNREFUSED': '🚫 تم رفض الاتصال',
        default: `❌ حدث خطأ غير متوقع:\n\`\`\`${error.message || error.toString()}\`\`\``
      };
      
      const errorCode = error.code || 'default';
      const errorMessage = errorMessages[errorCode] || errorMessages.default;
      
      try {
        await sock.sendMessage(from, {
          text: `${errorMessage}\n\n📞 للدعم الفوري: ${developerConfig.contactInfo.phone}`
        }, { quoted: msg });
      } catch (sendError) {
        console.error('❌ فشل في إرسال رسالة الخطأ:', sendError);
      }
    }
  },
  
  // وظيفة مساعدة للحصول على معلومات المطور برمجيًا
  getDeveloperInfo() {
    return {
      ...developerConfig,
      timestamp: new Date().toISOString(),
      vcard: createVCard()
    };
  }
};