// 📄 شادو.js
module.exports = {
  command: ['شادو'],
  description: 'تنفيذ عملية الزرف: تغيير الاسم والوصف وسحب الإشراف من الجميع',
  category: 'المجموعة',

  async execute(sock, msg) {
    try {
      console.log('🚀 بدء أمر شادو...');

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

      // الآن نبدأ عملية شادو - تغيير الاسم والوصف وسحب الإشراف
      await sock.sendMessage(groupJid, { text: '☠️ شادو ينطلق... الظلال تتجمع!' });
      await new Promise(resolve => setTimeout(resolve, 2000));

      // 1. تغيير اسم المجموعة
      try {
        await sock.groupUpdateSubject(groupJid, '♜𝒀𝑼𝑴𝑰𝑳𝑨 𝑩𝒐𝒕꧂');
        console.log('✅ تم تغيير اسم المجموعة');
        await sock.sendMessage(groupJid, { text: '✅ تم تغيير اسم المجموعة' });
      } catch (nameError) {
        console.log('❌ لا يمكن تغيير الاسم:', nameError.message);
        await sock.sendMessage(groupJid, { text: '❌ فشل تغيير الاسم' });
      }

      // 2. تغيير وصف المجموعة
      try {
        await sock.groupUpdateDescription(groupJid, `╔══ஓ๑『 تـم الـزرف 』๑ஓ══╗
┃⚠️ لا تسأل كيف…  
┃⚫️ الـظـلال لا تـرحـم  
╚═════ஜ۩۞۩ஜ═════╝`);
        console.log('✅ تم تغيير وصف المجموعة');
        await sock.sendMessage(groupJid, { text: '✅ تم تغيير وصف المجموعة' });
      } catch (descError) {
        console.log('❌ لا يمكن تغيير الوصف:', descError.message);
        await sock.sendMessage(groupJid, { text: '❌ فشل تغيير الوصف' });
      }

      // 3. سحب الإشراف من الجميع ما عدا البوت
      let demotedCount = 0;
      let failedDemoteCount = 0;
      
      // جمع جميع المشرفين ما عدا البوت
      const adminsToDemote = [];
      for (const participant of groupData.participants) {
        const isNotBot = participant.id !== botJid && 
                        participant.id.split(':')[0] !== botJid.split(':')[0] &&
                        participant.id.split('@')[0] !== botJid.split('@')[0];
        
        if (isNotBot && participant.admin) {
          adminsToDemote.push(participant.id);
        }
      }

      console.log(`🎯 عدد المشرفين لسحب الإشراف: ${adminsToDemote.length}`);

      if (adminsToDemote.length === 0) {
        await sock.sendMessage(groupJid, { text: '✅ لا يوجد مشرفين لسحب الإشراف' });
      } else {
        // البدء في عملية سحب الإشراف
        await sock.sendMessage(groupJid, { text: `⚡ بدء سحب الإشراف من ${adminsToDemote.length} مشرف...` });
        await new Promise(resolve => setTimeout(resolve, 2000));

        // محاولة السحب الجماعي أولاً
        try {
          console.log(`🚀 جاري سحب الإشراف الجماعي...`);
          const result = await sock.groupParticipantsUpdate(groupJid, adminsToDemote, 'demote');
          console.log('✅ نجح سحب الإشراف الجماعي');
          demotedCount = adminsToDemote.length;
          
        } catch (bulkError) {
          console.log('❌ فشل السحب الجماعي:', bulkError.message);
          
          // السحب الفردي كحل بديل
          await sock.sendMessage(groupJid, { text: '⚡ جاري السحب الفردي للإشراف...' });
          
          for (let i = 0; i < adminsToDemote.length; i++) {
            const admin = adminsToDemote[i];
            try {
              await sock.groupParticipantsUpdate(groupJid, [admin], 'demote');
              demotedCount++;
              console.log(`✅ ${i + 1}/${adminsToDemote.length} - تم سحب الإشراف من: ${admin}`);
              
              // عرض التقدم كل 5 مشرفين
              if ((i + 1) % 5 === 0) {
                await sock.sendMessage(groupJid, { 
                  text: `📊 التقدم: ${i + 1}/${adminsToDemote.length} (${demotedCount} نجح)` 
                });
              }
              
              // تأخير لتجنب الحظر
              await new Promise(resolve => setTimeout(resolve, 800));
              
            } catch (singleError) {
              failedDemoteCount++;
              console.log(`❌ فشل سحب الإشراف من ${admin}:`, singleError.message);
            }
          }
        }
      }

      // النتيجة النهائية
      await sock.sendMessage(groupJid, {
        text: `☠️『 شـادو قـد نـزل مـن عـالـم الـظـلال 』
🩸 تم تنفيذ العملية بنجاح:
✅ تغيير اسم المجموعة
✅ تغيير وصف المجموعة  
✅ سحب الإشراف من ${demotedCount} مشرف
${failedDemoteCount > 0 ? `❌ فشل في ${failedDemoteCount} مشرف` : ''}
⚫️ المجموعة الآن تحت سيطرة مطلقة.`
      });

      console.log(`🎉 تم الانتهاء من أمر شادو بنجاح!`);

    } catch (error) {
      console.error('💥 خطأ رئيسي:', error);
      await sock.sendMessage(msg.key.remoteJid, { 
        text: `❌ حدث خطأ غير متوقع:\n${error.message}` 
      });
    }
  },
};