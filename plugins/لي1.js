// *حقوق مطور يوميلا 🛡*
// 📄 لي1.js

const fs = require('fs');

module.exports = {
  command: ['لي1'],
  description: 'تغيير اسم ووصف المجموعة + إحصائيات + صوتين صالحين مع طباعة حالة البوت',
  category: 'المجموعة',

  async execute(sock, msg) {
    try {
      const groupId = msg.key.remoteJid;

      // التحقق من أن الأمر في مجموعة
      if (!groupId.endsWith('@g.us')) {
        return await sock.sendMessage(groupId, { 
          text: '❌ هذا الأمر للمجموعات فقط' 
        });
      }

      // جلب بيانات المجموعة
      const metadata = await sock.groupMetadata(groupId);
      const participants = metadata.participants;

      // التحقق من أن المرسل مشرف
      const sender = msg.key.participant || msg.key.remoteJid;
      const senderParticipant = participants.find(p => p.id === sender);
      
      if (!senderParticipant) {
        return await sock.sendMessage(groupId, {
          text: '❌ لم أتمكن من العثور عليك في قائمة المشاركين!'
        });
      }

      // طريقة موثوقة للتحقق من صلاحية المشرف
      const isSenderAdmin = senderParticipant && 
                           (senderParticipant.admin === 'admin' || 
                            senderParticipant.admin === 'superadmin' ||
                            senderParticipant.admin === true);

      if (!isSenderAdmin) {
        return await sock.sendMessage(groupId, {
          text: '❌ هذا الأمر للمشرفين فقط!'
        });
      }

      console.log("🚀 بدء تنفيذ أمر لي1");
      console.log("🔍 معلومات المجموعة الحالية:");
      console.log("- الاسم الحالي:", metadata.subject);
      console.log("- الوصف الحالي:", metadata.desc || 'لا يوجد');
      console.log("- المرسل:", sender);

      // تعريف الاسم والوصف الجديدين
      const NEW_GROUP_NAME = "مزروفين ||♜𝒀𝑼𝑴𝑰𝑳𝑨";
      const NEW_GROUP_DESC = "كلمات مرعبة لظل";

      // 1 - تغيير اسم المجموعة
      try {
        await sock.groupUpdateSubject(groupId, NEW_GROUP_NAME);
        console.log("✅ تم تغيير اسم المجموعة بنجاح إلى:", NEW_GROUP_NAME);
      } catch (nameErr) {
        console.error("❌ فشل تغيير اسم المجموعة:", nameErr);
        if (nameErr.message.includes('not admin') || nameErr.message.includes('403')) {
          return await sock.sendMessage(groupId, {
            text: '❌ لا أملك صلاحية تغيير اسم المجموعة! تأكد أني مشرف.'
          });
        }
        return await sock.sendMessage(groupId, {
          text: `❌ فشل تغيير اسم المجموعة:\n${nameErr.message}`
        });
      }

      // 2 - تغيير وصف المجموعة
      try {
        await sock.groupUpdateDescription(groupId, NEW_GROUP_DESC);
        console.log("✅ تم تغيير وصف المجموعة بنجاح إلى:", NEW_GROUP_DESC);
      } catch (descErr) {
        console.error("❌ فشل تغيير وصف المجموعة:", descErr);
        if (descErr.message.includes('not admin') || descErr.message.includes('403')) {
          await sock.sendMessage(groupId, {
            text: '⚠️ تم تغيير الاسم بنجاح ولكن لا أملك صلاحية تغيير الوصف!'
          });
        } else {
          await sock.sendMessage(groupId, {
            text: `⚠️ تم تغيير الاسم ولكن فشل تغيير الوصف:\n${descErr.message}`
          });
        }
      }

      // 3 - جلب إحصائيات المجموعة
      let admins = 0;
      let members = 0;
      let bots = 0;
      
      participants.forEach(p => {
        if (p.id.includes('@s.whatsapp.net') || p.id.includes('@c.us')) {
          if (p.admin === 'admin' || p.admin === 'superadmin' || p.admin === true) {
            admins++;
          } else {
            members++;
          }
        } else {
          bots++;
        }
      });
      
      const total = participants.length;

      // 4 - إرسال رسالة إحصائية مفصلة مع التأكيد على التغييرات
      const statsMessage = 
        `☠️ **يـــــومــــ❄ــــــيــــــــــيلا** ☠️\n` +
        `══════════════════════════\n` +
        `📊 **إحصائيات المجموعة**:\n` +
        `┣─ 👥 العدد الكلي: ${total}\n` +
        `┣─ 🛡️ المشرفين: ${admins}\n` +
        `┣─ 👤 الأعضاء العاديين: ${members}\n` +
        `┣─ 🤖 البوتات: ${bots}\n` +
        `══════════════════════════\n` +
        `✅ **تم تحديث المجموعة**:\n` +
        `├─ 🏷️ الاسم الجديد: "${NEW_GROUP_NAME}"\n` +
        `└─ 📝 الوصف الجديد: "${NEW_GROUP_DESC}"\n` +
        `══════════════════════════\n` +
        `🔊 سيتم إرسال ملفين صوتيين الآن...`;

      await sock.sendMessage(groupId, { text: statsMessage });

      // 5 - إرسال الملفات الصوتية
      const audioFiles = [
        { path: '/storage/emulated/0/bot/resources/shado_voice1.mp3', name: 'صوت يوميلا 1' },
        { path: '/storage/emulated/0/bot/resources/shado_voice2.mp3', name: 'صوت يوميلا 2' }
      ];

      let audioSentCount = 0;

      for (let i = 0; i < audioFiles.length; i++) {
        const audioFile = audioFiles[i];
        
        try {
          // التحقق من وجود الملف
          if (!fs.existsSync(audioFile.path)) {
            console.warn(`⚠️ الملف غير موجود: ${audioFile.path}`);
            
            // محاولة مسارات بديلة
            const alternativePaths = [
              `./resources/shado_voice${i+1}.mp3`,
              `./shado_voice${i+1}.mp3`,
              `/storage/emulated/0/bot/shado_voice${i+1}.mp3`
            ];
            
            let found = false;
            for (const altPath of alternativePaths) {
              if (fs.existsSync(altPath)) {
                audioFile.path = altPath;
                found = true;
                console.log(`✅ وجد الملف في المسار البديل: ${altPath}`);
                break;
              }
            }
            
            if (!found) {
              await sock.sendMessage(groupId, {
                text: `⚠️ ${audioFile.name} غير موجود\n` +
                      `🔍 ابحث عنه في مجلد resources`
              });
              continue;
            }
          }

          const audioBuffer = fs.readFileSync(audioFile.path);
          await sock.sendMessage(groupId, {
            audio: audioBuffer,
            mimetype: 'audio/mpeg',
            fileName: `shado_voice${i+1}.mp3`,
            ptt: true
          });

          console.log(`✅ تم إرسال ${audioFile.name}`);
          audioSentCount++;
          
          // انتظار بين الملفات
          if (i < audioFiles.length - 1) {
            await new Promise(resolve => setTimeout(resolve, 2000));
          }
          
        } catch (audioErr) {
          console.error(`❌ خطأ في ${audioFile.name}:`, audioErr);
          await sock.sendMessage(groupId, {
            text: `❌ فشل إرسال ${audioFile.name}`
          });
        }
      }

      // 6 - إرسال رسالة تأكيد نهائية
      const finalMessage = 
        `✅ **تم الانتهاء من تنفيذ أمر "لي1" بنجاح!**\n\n` +
        `📌 **التغييرات التي تمت:**\n` +
        `• تغيير اسم المجموعة: "${NEW_GROUP_NAME}"\n` +
        `• تغيير وصف المجموعة: "${NEW_GROUP_DESC}"\n` +
        `• عرض إحصائيات المجموعة\n` +
        `• إرسال ${audioSentCount}/${audioFiles.length} ملف صوتي\n\n` +
        `⚡ **مطور يوميلا** 🛡️\n` +
        `└─ جميع الحقوق محفوظة`;

      await sock.sendMessage(groupId, { text: finalMessage });

      console.log("🎉 تم تنفيذ أمر لي1 بنجاح!");
      console.log("📝 التفاصيل:");
      console.log("- الاسم الجديد:", NEW_GROUP_NAME);
      console.log("- الوصف الجديد:", NEW_GROUP_DESC);
      console.log("- الملفات الصوتية المرسلة:", audioSentCount);

    } catch (err) {
      console.error("❌ خطأ رئيسي في أمر لي1:", err);
      await sock.sendMessage(msg.key.remoteJid, {
        text: `❌ حدث خطأ غير متوقع في تنفيذ الأمر:\n\n` +
              `📌 الخطأ: ${err.message || 'غير معروف'}\n` +
              `🔍 الحل: تأكد من صلاحيات البوت وإعادة المحاولة`
      });
    }
  }
};