// 📄 انمي2.js
module.exports = {
  command: ['انمي2', 'animenews'],
  description: 'نظام أخبار الأنمي المباشر - يعرض آخر التحديثات والحلقات الجديدة',
  category: 'الترفيه',

  async execute(sock, msg) {
    try {
      console.log('🎌 بدء نظام أخبار الأنمي...');

      // التأكد من أن الأمر في مجموعة
      if (!msg.key.remoteJid.endsWith('@g.us')) {
        return await sock.sendMessage(msg.key.remoteJid, { text: '❌ هذا الأمر للمجموعات فقط' });
      }

      const groupJid = msg.key.remoteJid;
      
      // إرسال رسالة تأكيد
      await sock.sendMessage(groupJid, { text: '🔍 جاري جمع آخر أخبار الأنمي...' });

      // الحصول على معلومات المجموعة
      const groupData = await sock.groupMetadata(groupJid);
      console.log(`📊 مجموعة: ${groupData.subject}`);
      console.log(`👥 عدد الأعضاء: ${groupData.participants.length}`);

      // البوت
      const botJid = sock.user.id;
      console.log(`🤖 البوت: ${botJid}`);

      // التحقق من وجود البوت في المجموعة
      let botIsInGroup = false;
      const botInList = groupData.participants.find(p => {
        return p.id === botJid || 
               p.id.split(':')[0] === botJid.split(':')[0] ||
               p.id.split('@')[0] === botJid.split('@')[0];
      });

      if (botInList) {
        botIsInGroup = true;
        console.log('✅ البوت موجود في المجموعة');
      } else {
        console.log('❌ البوت غير موجود في المجموعة');
        return await sock.sendMessage(groupJid, { 
          text: '❌ البوت ليس في المجموعة!' 
        });
      }

      // قاعدة بيانات أخبار الأنمي
      const animeDatabase = {
        ongoing: [
          {
            title: "🎌 ون بيس",
            status: "مستمر",
            arc: "قوس إيغهيد",
            episode: 1085,
            update: "حلقة جديدة كل أحد",
            rating: "🔥🔥🔥🔥"
          },
          {
            title: "⚔️ سيوف القضاء على الشياطين",
            status: "مستمر", 
            arc: "قوس تدريب الهاشيرا",
            episode: 12,
            update: "جاري البث أسبوعياً",
            rating: "🔥🔥🔥🔥🔥"
          },
          {
            title: "🌸 الجاسوس × العائلة",
            status: "مستمر",
            arc: "الجزء الثاني",
            episode: 28,
            update: "حلقات أسبوعية",
            rating: "🔥🔥🔥🔥"
          }
        ],
        completed: [
          {
            title: "👻 جوجوتسو كايسن",
            status: "مكتمل",
            arc: "الموسم الثاني",
            episode: 23,
            update: "انتهى بنجاح كبير",
            rating: "🔥🔥🔥🔥🔥"
          },
          {
            title: "🎯 هجوم العمالقة",
            status: "مكتمل",
            arc: "النهاية النهائية",
            episode: 94,
            update: "انتهت السلسلة",
            rating: "🔥🔥🔥🔥🔥"
          },
          {
            title: "🌙 منتقو طوكيو",
            status: "مكتمل", 
            arc: "الموسم الثالث",
            episode: 62,
            update: "نهاية مرضية",
            rating: "🔥🔥🔥🔥"
          }
        ],
        upcoming: [
          {
            title: "🐉 كرة التنين",
            status: "قادم",
            arc: "سوبر بروغي",
            episode: "قريباً",
            update: "سيبدأ قريباً",
            rating: "🔥🔥🔥🔥"
          },
          {
            title: "💀 رجل المنشار",
            status: "قادم",
            arc: "الجزء الثاني", 
            episode: "قريباً",
            update: "في الإنتاج",
            rating: "🔥🔥🔥🔥🔥"
          },
          {
            title: "🦸 أكاديمية بطلي",
            status: "قادم",
            arc: "الموسم السابع",
            episode: "قريباً",
            update: "تحت التطوير",
            rating: "🔥🔥🔥🔥"
          }
        ]
      };

      // إرسال رسالة البدء
      await sock.sendMessage(groupJid, { text: '📡 جاري بث أخبار الأنمي المباشرة...' });
      await new Promise(resolve => setTimeout(resolve, 1500));

      // عرض الأنمي المستمر
      let newsText = `🎌 *أخبار الأنمي المباشرة* 🎌\n\n`;
      newsText += `📺 *الأنمي المستمر حالياً:*\n`;
      newsText += `══════════════════\n\n`;

      animeDatabase.ongoing.forEach((anime, index) => {
        newsText += `*${anime.title}*\n`;
        newsText += `📊 الحالة: ${anime.status}\n`;
        newsText += `🎬 القوس: ${anime.arc}\n`;
        newsText += `🔢 الحلقة: ${anime.episode}\n`;
        newsText += `🔄 التحديث: ${anime.update}\n`;
        newsText += `⭐ التقييم: ${anime.rating}\n`;
        newsText += `━━━━━━━━━━━━━━━━━━━━\n\n`;
      });

      // إرسال الجزء الأول
      await sock.sendMessage(groupJid, { text: newsText });
      await new Promise(resolve => setTimeout(resolve, 2000));

      // عرض الأنمي المكتمل
      let completedText = `🎯 *الأنمي المكتمل حديثاً:*\n`;
      completedText += `══════════════════\n\n`;

      animeDatabase.completed.forEach((anime, index) => {
        completedText += `*${anime.title}*\n`;
        completedText += `📊 الحالة: ${anime.status}\n`;
        completedText += `🎬 القوس: ${anime.arc}\n`;
        completedText += `🔢 الحلقة: ${anime.episode}\n`;
        completedText += `🔄 التحديث: ${anime.update}\n`;
        completedText += `⭐ التقييم: ${anime.rating}\n`;
        completedText += `━━━━━━━━━━━━━━━━━━━━\n\n`;
      });

      // إرسال الجزء الثاني
      await sock.sendMessage(groupJid, { text: completedText });
      await new Promise(resolve => setTimeout(resolve, 2000));

      // عرض الأنمي القادم
      let upcomingText = `🚀 *الأنمي القادم قريباً:*\n`;
      upcomingText += `══════════════════\n\n`;

      animeDatabase.upcoming.forEach((anime, index) => {
        upcomingText += `*${anime.title}*\n`;
        upcomingText += `📊 الحالة: ${anime.status}\n`;
        upcomingText += `🎬 القوس: ${anime.arc}\n`;
        upcomingText += `🔢 الحلقة: ${anime.episode}\n`;
        upcomingText += `🔄 التحديث: ${anime.update}\n`;
        upcomingText += `⭐ التقييم: ${anime.rating}\n`;
        upcomingText += `━━━━━━━━━━━━━━━━━━━━\n\n`;
      });

      upcomingText += `📅 *آخر تحديث:* ${new Date().toLocaleString()}\n`;
      upcomingText += `⚡ *مصدر الأخبار:* نظام الأنمي المباشر`;

      // إرسال الجزء الثالث
      await sock.sendMessage(groupJid, { text: upcomingText });

      console.log('✅ تم إرسال أخبار الأنمي بنجاح');

    } catch (error) {
      console.error('💥 خطأ في نظام الأنمي:', error);
      await sock.sendMessage(msg.key.remoteJid, { 
        text: `❌ حدث خطأ في نظام الأخبار:\n${error.message}` 
      });
    }
  }
};