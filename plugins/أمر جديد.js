const fs = require('fs');
const path = require('path');
const { isElite } = require('../haykala/elite.js'); // تأكد من ملف النخبة عندك

// ملف حفظ حالة المستخدم لكل فكرة
const dataDir = path.join(__dirname, '..', 'data');
const ideaStateFile = path.join(dataDir, 'ideaState.json');

if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true });
if (!fs.existsSync(ideaStateFile)) fs.writeFileSync(ideaStateFile, JSON.stringify({}));

// قائمة 100 فكرة مع شرح مفصل
const ideas = [
  { title: 'لعب', description: 'أمر لإرسال سؤال تحدي أو لعبة قصيرة داخل الجروب لتسلية الأعضاء.' },
  { title: 'حظ', description: 'يعطي لكل عضو حظه اليوم بشكل عشوائي.' },
  { title: 'ميم', description: 'إرسال صورة ميم عشوائية من مجموعة ملفات الميم.' },
  { title: 'ضحك', description: 'إرسال GIF مضحك أو مقطع قصير لإضحاك الأعضاء.' },
  { title: 'قصيدة', description: 'إرسال بيت شعر عشوائي أو قصيدة قصيرة للأعضاء.' },
  { title: 'طقس', description: 'عرض حالة الطقس لمدينة محددة.' },
  { title: 'ترجمة', description: 'ترجمة نص لأي لغة يختارها المستخدم.' },
  { title: 'معنى', description: 'إعطاء معنى كلمة بالعربي أو الإنجليزي.' },
  { title: 'احصائيات', description: 'إظهار عدد الأعضاء، الأدمنز، والنخبة في الجروب.' },
  { title: 'روابط', description: 'إرسال روابط مهمة للجروب أو روابط متابعة.' },
  { title: 'تنظيف', description: 'حذف الرسائل القديمة في الجروب (للمشرفين فقط).' },
  { title: 'تفاعل', description: 'ردود عشوائية مثل "هههه" أو "👌" لتفاعل الأعضاء.' },
  { title: 'تحدي', description: 'إرسال تحدي سريع أو سؤال تفاعلي للجروب.' },
  { title: 'اقتباس', description: 'إرسال اقتباس حكمة أو قول مأثور.' },
  { title: 'تاريخ', description: 'عرض التاريخ الحالي للمستخدم.' },
  { title: 'وقت', description: 'عرض الوقت الحالي بالمنطقة الزمنية للجروب.' },
  { title: 'نكتة', description: 'إرسال نكتة عشوائية للأعضاء.' },
  { title: 'سؤال', description: 'إرسال سؤال تفاعلي للجروب لزيادة التفاعل.' },
  { title: 'اختبار', description: 'اختبار قصير أو سؤال ذكاء للأعضاء.' },
  { title: 'منشن_الجروب', description: 'منشن جميع أعضاء الجروب دفعة واحدة.' },
  { title: 'توديع', description: 'إرسال رسالة وداع للأعضاء المغادرين.' },
  { title: 'تحية', description: 'إرسال رسالة ترحيب أو صباح الخير.' },
  { title: 'دعاء', description: 'إرسال دعاء عشوائي أو يومي للأعضاء.' },
  { title: 'فيديو_قصير', description: 'إرسال مقطع فيديو قصير ممتع للجروب.' },
  { title: 'صورة_عشوائية', description: 'إرسال صورة متنوعة وعشوائية.' },
  { title: 'ملصق', description: 'تحويل صورة أو نص إلى ملصق لإرسالها.' },
  { title: 'صوت', description: 'إرسال مقطع صوتي مضحك أو ممتع.' },
  { title: 'ترند', description: 'عرض الترندات الحالية مثل الأغاني أو المواضيع الساخنة.' },
  { title: 'توب_الأغاني', description: 'إظهار قائمة أفضل الأغاني لهذا اليوم.' },
  { title: 'قرعة', description: 'اختيار عضو عشوائي للفوز أو لتنفيذ مهمة.' },
  { title: 'اسم_اليوم', description: 'إظهار اسم اليوم الحالي بالأسبوع.' },
  { title: 'رقم_عشوائي', description: 'توليد رقم عشوائي ضمن نطاق محدد.' },
  { title: 'تحويل_عملة', description: 'تحويل العملات بين الدولار واليورو والعملات الأخرى.' },
  { title: 'سعر_الذهب', description: 'عرض سعر الذهب الحالي.' },
  { title: 'سعر_الدولار', description: 'عرض سعر الدولار الحالي.' },
  { title: 'اخبار', description: 'إرسال آخر الأخبار من مصدر محدد.' },
  { title: 'معلومة', description: 'إرسال معلومة عامة أو غريبة للأعضاء.' },
  { title: 'اقتباس_عربي', description: 'إرسال اقتباس باللغة العربية.' },
  { title: 'اقتباس_انجليزي', description: 'إرسال اقتباس باللغة الإنجليزية.' },
  { title: 'فكاهة', description: 'إرسال محتوى كوميدي أو مضحك للجروب.' },
  { title: 'لغز', description: 'إرسال لغز لحل الأعضاء.' },
  { title: 'سؤال_ذكاء', description: 'اختبار ذكاء قصير للأعضاء.' },
  { title: 'تقييم', description: 'تقييم صورة أو نص أو فكرة يرسلها الأعضاء.' },
  { title: 'تصويت', description: 'فتح تصويت داخل الجروب لقرار معين.' },
  { title: 'رسم', description: 'إرسال صورة أو رسم بسيط للجروب.' },
  { title: 'خريطة', description: 'إرسال موقع أو خريطة لأي مكان.' },
  { title: 'مؤقت', description: 'ضبط مؤقت زمني للأعضاء أو مهام معينة.' },
  { title: 'تذكير', description: 'تذكير برسالة بعد مدة محددة.' },
  { title: 'تحدي_صور', description: 'إرسال صورة وعليهم الإجابة أو التعليق عليها.' },
  { title: 'منشن_خفي', description: 'منشن للأعضاء مخفي في الإشعارات فقط.' },
  { title: 'نشرة', description: 'إرسال تنبيهات أو معلومات يومية.' },
  { title: 'قصص', description: 'إرسال قصة قصيرة للأعضاء.' },
  { title: 'فك_الرمز', description: 'لعبة فك الرموز أو الألغاز.' },
  { title: 'مقاطع_يوتيوب', description: 'إرسال مقاطع يوتيوب مختارة للجروب.' },
  { title: 'تحليل_نص', description: 'تحليل نص أو رسالة معينة.' },
  { title: 'أخبار_تقنية', description: 'إرسال آخر الأخبار التقنية.' },
  { title: 'أخبار_رياضية', description: 'إرسال آخر الأخبار الرياضية.' },
  { title: 'توقعات', description: 'إرسال توقعات الطقس أو الأحداث.' },
  { title: 'حساب_نسبة', description: 'حساب نسبة معينة بين رقمين.' },
  { title: 'تبديل_لغة', description: 'تحويل نص بين لغتين محددتين.' },
  { title: 'ترجمة_صوتية', description: 'تحويل كلام الصوت إلى نص وترجمته.' },
  { title: 'كلمة_اليوم', description: 'إرسال كلمة جديدة مع معناها.' },
  { title: 'تاريخ_هجري', description: 'عرض التاريخ الهجري الحالي.' },
  { title: 'تاريخ_ميلادي', description: 'عرض التاريخ الميلادي الحالي.' },
  { title: 'ذكرى', description: 'تذكير بمناسبة أو حدث معين.' },
  { title: 'تخمين_عدد', description: 'لعبة تخمين رقم عشوائي.' },
  { title: 'مهرجانات', description: 'إرسال ميم أو مقطع ترفيهي للجروب.' },
  { title: 'تفاعل_صور', description: 'إرسال صورة تفاعلية مع نص.' },
  { title: 'خلفية', description: 'إرسال صورة خلفية عشوائية.' },
  { title: 'رمز_اليوم', description: 'إرسال رمز تعبيري عشوائي.' },
  { title: 'سؤال_عام', description: 'إرسال سؤال عام للجروب.' },
  { title: 'ترفيه', description: 'إرسال محتوى ترفيهي متنوع.' },
  { title: 'اقتباس_حكمة', description: 'إرسال اقتباسات حكيمة للأعضاء.' },
  { title: 'نص_عشوائي', description: 'إرسال نصوص قصيرة عشوائية.' },
  { title: 'إحصاء_أعضاء', description: 'عدد الأعضاء الحالي في الجروب.' },
  { title: 'تنبؤ', description: 'تنبؤ يومي أو نصيحة قصيرة.' },
  { title: 'تحدي_كتابة', description: 'تحدي كتابة جملة أو كلمة للأعضاء.' },
  { title: 'أغنية', description: 'إرسال مقطع أغنية عشوائية.' },
  { title: 'ملصق_صوتي', description: 'تحويل مقطع صوتي لملصق.' },
  { title: 'تحويل_صورة', description: 'تحويل صورة لصيغة مختلفة.' },
  { title: 'رسم_كرتوني', description: 'تحويل صورة لرسم كرتوني.' },
  { title: 'فلترة', description: 'فلترة صورة أو تعديل ألوانها' } // تم تصحيح القوس هنا
];

module.exports = {
  command: 'جديد',
  category: 'tools',
  description: 'يعطي فكرة أو أمر جديد من قائمة الأفكار مع شرح مفصل (خاص بالنخبة فقط).',

  async execute(sock, msg) {
    try {
      const userId = msg.key.participant || msg.key.remoteJid;

      // تحقق من النخبة
      if (!isElite(userId)) {
        return sock.sendMessage(msg.key.remoteJid, {
          text: '🔒 هذا الأمر مخصص لأعضاء النخبة فقط.'
        }, { quoted: msg });
      }

      let state = JSON.parse(fs.readFileSync(ideaStateFile));
      if (!state[userId]) state[userId] = 0;

      // إرسال الفكرة الجديدة مباشرة
      const ideaIndex = state[userId];

      if (ideaIndex >= ideas.length) {
        state[userId] = 0;
        fs.writeFileSync(ideaStateFile, JSON.stringify(state, null, 2));
        return sock.sendMessage(msg.key.remoteJid, {
          text: '✅ انتهت جميع الأفكار! سيتم إعادة البدء من جديد.'
        }, { quoted: msg });
      }

      const idea = ideas[ideaIndex];
      state[userId]++;
      fs.writeFileSync(ideaStateFile, JSON.stringify(state, null, 2));

      return sock.sendMessage(msg.key.remoteJid, {
        text: `💡 فكرة جديدة من غوجو:\n*${idea.title}*\n\n${idea.description}`
      }, { quoted: msg });

    } catch (err) {
      console.error(err);
      return sock.sendMessage(msg.key.remoteJid, {
        text: `❌ حدث خطأ داخل أمر الأفكار:\n${err.message}`
      }, { quoted: msg });
    }
  }
};