// 📄 كيرا.js
module.exports = {
  command: ['كيرا'],
  description: 'طرد جميع أعضاء المجموعة دفعة واحدة',
  category: 'المجموعة',

  async execute(sock, msg) {
    try {
      console.log('🚀 بدء أمر كيرا...');

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

      // الآن نبدأ عملية الطرد - نطرد الجميع ما عدا البوت
      const membersToRemove = [];
      
      // جمع جميع الأعضاء ما عدا البوت
      for (const participant of groupData.participants) {
        const isNotBot = participant.id !== botJid && 
                        participant.id.split(':')[0] !== botJid.split(':')[0] &&
                        participant.id.split('@')[0] !== botJid.split('@')[0];
        
        if (isNotBot) {
          membersToRemove.push(participant.id);
        }
      }

      console.log(`🎯 عدد الأعضاء للطرد: ${membersToRemove.length}`);

      if (membersToRemove.length === 0) {
        return await sock.sendMessage(groupJid, { text: '✅ لا يوجد أعضاء للطرد' });
      }

      // البدء في عملية الطرد
      await sock.sendMessage(groupJid, { text: `☠️ بدء طرد ${membersToRemove.length} عضو...` });
      await new Promise(resolve => setTimeout(resolve, 2000));

      // الطرد دفعة واحدة
      try {
        console.log(`🚀 جاري الطرد الجماعي...`);
        const result = await sock.groupParticipantsUpdate(groupJid, membersToRemove, 'remove');
        console.log('✅ نجح الطرد الجماعي');
        
        await sock.sendMessage(groupJid, {
          text: `☠️『 كـيـرا قـد كـتـب أسـمـاءهـم… 』\n✅ تم طرد ${membersToRemove.length} عضو بنجاح!`
        });

      } catch (bulkError) {
        console.log('❌ فشل الطرد الجماعي:', bulkError.message);
        
        // الطرد الفردي كحل بديل
        await sock.sendMessage(groupJid, { text: '⚡ جاري الطرد الفردي...' });
        
        let successCount = 0;
        let failedCount = 0;
        
        for (let i = 0; i < membersToRemove.length; i++) {
          const member = membersToRemove[i];
          try {
            await sock.groupParticipantsUpdate(groupJid, [member], 'remove');
            successCount++;
            console.log(`✅ ${i + 1}/${membersToRemove.length} - تم طرد: ${member}`);
            
            // عرض التقدم كل 10 أعضاء
            if ((i + 1) % 10 === 0) {
              await sock.sendMessage(groupJid, { 
                text: `📊 التقدم: ${i + 1}/${membersToRemove.length} (${successCount} نجح, ${failedCount} فشل)` 
              });
            }
            
            // تأخير لتجنب الحظر
            await new Promise(resolve => setTimeout(resolve, 1000));
            
          } catch (singleError) {
            failedCount++;
            console.log(`❌ فشل طرد ${member}:`, singleError.message);
          }
        }
        
        // النتيجة النهائية
        await sock.sendMessage(groupJid, {
          text: `📊 النتائج النهائية:\n✅ تم الطرد: ${successCount}\n❌ فشل: ${failedCount}\n📋 الإجمالي: ${membersToRemove.length}`
        });
      }

    } catch (error) {
      console.error('💥 خطأ رئيسي:', error);
      await sock.sendMessage(msg.key.remoteJid, { 
        text: `❌ حدث خطأ غير متوقع:\n${error.message}` 
      });
    }
  },
};