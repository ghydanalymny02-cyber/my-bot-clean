// 📄 حماية2.js
module.exports = {
  command: ['2حماية'],
  description: 'حماية المجموعة من الروابط: طرد أي عضو يرسل رابط باستثناء النخبة والبوت والمحميين',
  category: 'المجموعة',

  async execute(sock, msg) {
    try {
      console.log('🛡️ بدء أمر حماية الروابط...');

      // التأكد من أن الأمر في مجموعة
      if (!msg.key.remoteJid.endsWith('@g.us')) {
        return await sock.sendMessage(msg.key.remoteJid, { text: '❌ هذا الأمر للمجموعات فقط' });
      }

      const groupJid = msg.key.remoteJid;
      
      // إرسال رسالة تأكيد الوجود أولاً
      await sock.sendMessage(groupJid, { text: '🔍 البوت هنا ويبدأ العمل...' });

      // الحصول على معلومات المجموعة
      const groupData = await sock.groupMetadata(groupJid);
      console.log(`📊 مجموعة: ${groupData.subject}`);
      console.log(`👥 عدد الأعضاء: ${groupData.participants.length}`);

      // البوت
      const botJid = sock.user.id;
      console.log(`🤖 البوت: ${botJid}`);

      // طريقة ذكية للتحقق من وجود البوت بدون الاعتماد على القائمة
      let botIsInGroup = false;
      let botIsAdmin = false;

      // المحاولة 1: البحث في القائمة
      const botInList = groupData.participants.find(p => {
        // مقارنة بطرق مختلفة
        return p.id === botJid || 
               p.id.split(':')[0] === botJid.split(':')[0] ||
               p.id.split('@')[0] === botJid.split('@')[0];
      });

      if (botInList) {
        botIsInGroup = true;
        botIsAdmin = botInList.admin === 'admin' || botInList.admin === 'superadmin' || botInList.admin === true;
        console.log(`✅ البوت موجود في القائمة - مشرف: ${botIsAdmin}`);
      } else {
        console.log('❌ البوت غير موجود في القائمة، جرب طريقة بديلة...');
        
        // المحاولة 2: اختبار عملي - محاولة تغيير إعدادات المجموعة
        try {
          // محاولة إجراء عمل يتطلب صلاحيات المشرف
          await sock.groupUpdateSubject(groupJid, groupData.subject + ' ');
          await sock.groupUpdateSubject(groupJid, groupData.subject);
          console.log('✅ البوت يستطيع تغيير إعدادات المجموعة - إذاً هو مشرف');
          botIsInGroup = true;
          botIsAdmin = true;
        } catch (adminTestError) {
          console.log('❌ البوت لا يستطيع تغيير الإعدادات:', adminTestError.message);
          
          // المحاولة 3: اختبار إرسال رسالة للجميع
          try {
            await sock.sendMessage(groupJid, { text: '🔍 اختبار الصلاحيات...' });
            botIsInGroup = true;
            botIsAdmin = false; // يستطيع الإرسال لكن ليس مشرف
            console.log('✅ البوت يستطيع الإرسال لكن ليس مشرف');
          } catch (sendError) {
            console.log('❌ البوت لا يستطيع الإرسال:', sendError.message);
            botIsInGroup = false;
          }
        }
      }

      // إذا لم يكن البوت في المجموعة
      if (!botIsInGroup) {
        return await sock.sendMessage(groupJid, { 
          text: '❌ البوت ليس في المجموعة! أعد إضافته وحاول مرة أخرى.' 
        });
      }

      // إذا لم يكن البوت مشرف
      if (!botIsAdmin) {
        return await sock.sendMessage(groupJid, { 
          text: '❌ البوت ليس مشرفاً! يرجى ترقيته إلى مشرف أولاً.' 
        });
      }

      // قوائم الاستثناء
      const eliteUsers = [
        '963996097873', // النخبة المحمية
        '963996097873'  // يمكن إضافة المزيد
      ];

      const protectedUsers = [];
      let protectionActive = true;

      // تعريف regex للروابط
      const linkRegex = /(https?:\/\/[^\s]+|www\.[^\s]+|t\.me\/[^\s]+|bit\.ly\/[^\s]+)/gi;

      // الآن نبدأ عملية تفعيل الحماية
      await sock.sendMessage(groupJid, { text: '🛡️ نظام الحماية ينطلق... جاري التفعيل!' });
      await new Promise(resolve => setTimeout(resolve, 2000));

      // رسالة تفعيل النظام
      await sock.sendMessage(groupJid, {
        text: `🛡️『 نظام حماية الروابط مفعل 』
✅ أي رابط يتم إرساله → طرد مباشر
🔒 المحميون من الطرد:
• البوت نفسه
• النخبة (${eliteUsers.join(', ')})
• الأعضاء المضافين يدوياً
⚡ المجموعة الآن تحت حماية كاملة.

📝 لإضافة عضو للحماية:
!حماية @المستخدم

📝 لإزالة الحماية:
!حماية-ايقاف`
      });

      console.log('🎉 تم تفعيل حماية الروابط بنجاح!');

      // إضافة مستخدم للحماية عبر المنشن
      const messageText = msg.message.conversation || msg.message.extendedTextMessage?.text || '';
      if (msg.message.extendedTextMessage && msg.message.extendedTextMessage.contextInfo?.mentionedJid) {
        const mentioned = msg.message.extendedTextMessage.contextInfo.mentionedJid;
        let addedCount = 0;
        
        for (const user of mentioned) {
          if (!protectedUsers.includes(user)) {
            protectedUsers.push(user);
            addedCount++;
            console.log(`🛡️ تمت إضافة ${user} لقائمة الحماية`);
          }
        }
        
        if (addedCount > 0) {
          await sock.sendMessage(groupJid, { 
            text: `✅ تمت إضافة ${addedCount} عضو لقائمة الحماية من الطرد بسبب الروابط`,
            mentions: mentioned
          });
        }
      }

      // نظام مراقبة الرسائل
      const messageHandler = async ({ messages }) => {
        if (!protectionActive) return;
        
        const m = messages[0];
        if (!m.message || !m.key.remoteJid.endsWith('@g.us') || m.key.remoteJid !== groupJid) return;

        const body = m.message.conversation || 
                    m.message.extendedTextMessage?.text || 
                    m.message.imageMessage?.caption || '';

        if (linkRegex.test(body)) {
          const sender = m.key.participant || m.key.remoteJid;
          const senderNumber = sender.split('@')[0].replace('+', '').replace(':', '').trim();

          console.log(`🔍 كشف رابط من: ${senderNumber}`);

          // تحقق من الاستثناءات
          const isProtected = eliteUsers.some(elite => {
            const cleanElite = elite.replace('+', '').trim();
            return senderNumber === cleanElite || senderNumber.endsWith(cleanElite);
          }) || protectedUsers.includes(sender) || sender === botJid;

          if (isProtected) {
            console.log(`🛡️ ${senderNumber} محمي من الطرد`);
            await sock.sendMessage(groupJid, { 
              text: `🔒 العضو @${senderNumber} محمي من الطرد بسبب الروابط`, 
              mentions: [sender] 
            });
            return;
          }

          // محاولة الطرد
          try {
            console.log(`🚫 محاولة طرد ${senderNumber} بسبب رابط`);
            await sock.groupParticipantsUpdate(groupJid, [sender], 'remove');
            await sock.sendMessage(groupJid, { 
              text: `🚫 تم طرد @${senderNumber} بسبب إرسال رابط`, 
              mentions: [sender] 
            });
            console.log(`✅ تم طرد ${senderNumber} بنجاح`);
          } catch (err) {
            console.log(`❌ فشل طرد ${senderNumber}:`, err.message);
            await sock.sendMessage(groupJid, { 
              text: `⚠️ فشل طرد @${senderNumber} - قد يحتاج البوت صلاحيات أعلى`,
              mentions: [sender]
            });
          }
        }
      };

      // إضافة المستمع للرسائل
      sock.ev.on('messages.upsert', messageHandler);

      // أمر لإيقاف الحماية
      if (messageText.includes('ايقاف') || messageText.includes('وقف')) {
        protectionActive = false;
        sock.ev.off('messages.upsert', messageHandler);
        await sock.sendMessage(groupJid, { text: '🛑 تم إيقاف نظام حماية الروابط' });
        console.log('🛑 تم إيقاف حماية الروابط');
      }

    } catch (error) {
      console.error('💥 خطأ رئيسي:', error);
      await sock.sendMessage(msg.key.remoteJid, { 
        text: `❌ حدث خطأ غير متوقع:\n${error.message}` 
      });
    }
  }
};