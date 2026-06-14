// دالة الـ sleep الذاتية لضمان عمل التايمر بدون ملفات خارجية
const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

module.exports = {
  command: 'أرقام',          // تحويله إلى command ليتوافق مع الهاندلر
  description: 'لعبة اختيار الأرقام والتصفيات ومقارنة النتائج (خطيرة 💀)',
  category: 'ألعاب',

  async execute(sock, msg) {
    const from = msg.key.remoteJid;

    // 1. التأكد أن اللعبة تُفتح داخل مجموعة فقط
    if (!from.endsWith('@g.us')) {
      return sock.sendMessage(from, { text: '❌ هذا الأمر يعمل فقط داخل المجموعات.' }, { quoted: msg });
    }

    try {
      // جلب بيانات الأعضاء والمشرفين
      const groupMetadata = await sock.groupMetadata(from);
      const participants = groupMetadata.participants;
      const admins = participants.filter(p => p.admin !== null).map(p => p.id);

      // تصفية اللاعبين (الأعضاء العاديين فقط استثناء المشرفين لحمايتهم من الطرد العشوائي)
      let players = participants
        .filter(p => !admins.includes(p.id))
        .map(p => ({ id: p.id, points: 10, choice: null }));

      if (players.length < 2) {
        return sock.sendMessage(from, { text: '❌ يجب أن يكون هناك على الأقل لاعبان غير مشرفين لبدء اللعبة.' }, { quoted: msg });
      }

      await sock.sendMessage(from, { text: '⏳ *جاري تجهيز الساحة.. اللعبة ستبدأ بعد 3 ثواني!*' });
      await sleep(3000);
      await sock.sendMessage(from, { text: '🔥 *اللعبة بدأت رسمياً! حظاً موفقاً للجميع.*' });

      // 2. إجراءات قفل المجموعة وتغيير الرابط لحماية اللعبة
      await sleep(4000);
      await sock.groupSettingUpdate(from, 'announcement'); // قفل الشات
      await sock.groupRevokeInvite(from); // تغيير رابط المجموعة
      await sock.sendMessage(from, { text: '🔒 *تم تغيير رابط المجموعة وإغلاق الشات لتأمين الجولة!*' });

      // دالة عرض النقاط المحدثة
      const sendPoints = async () => {
        let pointsMsg = `📊 *نقاط الأعضاء الحاليين:*\n\n`;
        for (const player of players) {
          pointsMsg += `• @${player.id.split('@')[0]} : [ ${player.points} ] نقاط\n`;
        }
        await sock.sendMessage(from, { text: pointsMsg, mentions: players.map(p => p.id) });
      };

      await sendPoints();
      let round = 1;

      // حلقة الجولات المستمرة طالما يوجد أكثر من لاعب
      while (players.length > 1) {
        await sleep(3000);
        await sock.sendMessage(from, {
          text: `📝 *[ الجولة ${round} ]*\n\n🔢 اختر رقمًا بين *0 و 100*..\n⚠️ *تنبيه حتمي:* أي رسالة غير رقمية أو خارج النطاق تؤدي إلى الطرد فوراً!\n⏳ لديك *30 ثانية* فقط للاختيار وتفتح المشاهدة الآن.`
        });

        // فتح الشات للاستقبال
        await sock.groupSettingUpdate(from, 'not_announcement');

        let choices = {};
        
        // مستمع الرسائل الذكي لفحص المدخلات وطرد المخالفين فوراً
        const messageListener = async (chatUpdate) => {
          const message = chatUpdate.messages[0];
          if (!message || message.key.remoteJid !== from) return;
          
          const sender = message.key.participant || message.key.remoteJid;

          // التأكد أن المرسل من ضمن اللاعبين الحاليين ولم يتم طرده
          if (!players.some(p => p.id === sender) || !message.message) return;

          const text = (message.message.conversation || message.message.extendedTextMessage?.text || '').trim();

          // التحقق: إذا كانت الرسالة ليست رقماً
          if (!/^\d+$/.test(text)) {
            await sock.groupParticipantsUpdate(from, [sender], 'remove');
            await sock.sendMessage(from, { text: `🚫 *تم طرد @${sender.split('@')[0]} فوراً بسبب إرسال رسالة غير رقمية!*`, mentions: [sender] });
            players = players.filter(p => p.id !== sender);
          } else {
            const num = parseInt(text);
            if (num >= 0 && num <= 100) {
              choices[sender] = num; // تسجيل الرقم الصحيح
            } else {
              // طرد إذا كان الرقم خارج نطاق 0-100
              await sock.groupParticipantsUpdate(from, [sender], 'remove');
              await sock.sendMessage(from, { text: `🚫 *تم طرد @${sender.split('@')[0]} لأن الرقم خارج النطاق (0-100)!*`, mentions: [sender] });
              players = players.filter(p => p.id !== sender);
            }
          }
        };

        // تفعيل مستمع الرسائل للواتساب
        sock.ev.on('messages.upsert', messageListener);

        // عداد تنازلي وهمي في الشات (30 ثانية)
        let countdownMsg = await sock.sendMessage(from, { text: '*⏰ الوقت المتبقي: 30 ثانية*' });
        for (let i = 29; i >= 0; i--) {
          await sleep(1000);
          // فحص سريع إذا تم طرد كل اللاعبين أثناء العد التنازلي لإيقاف الحلقة
          if (players.length <= 1) break;
          await sock.sendMessage(from, { text: `*⏰ الوقت المتبقي: ${i} ثانية*`, edit: countdownMsg.key });
        }

        // إيقاف مستمع الرسائل بعد انتهاء الوقت لقفل الاستقبال
        sock.ev.off('messages.upsert', messageListener);
        await sleep(2000);

        // قفل الشات مجدداً لحساب النتائج
        await sock.groupSettingUpdate(from, 'announcement');
        await sock.sendMessage(from, { text: '⏳ *انتهى الوقت! جاري جمع الأرقام وفحص النتائج..*' });

        if (players.length <= 1) break;

        // تعيين 0 لمن لم يقم بالاختيار خلال الوقت
        for (const player of players) {
          player.choice = choices[player.id] !== undefined ? choices[player.id] : 0;
        }

        // عرض الأرقام المفتوحة للاعبين
        let numbersMsg = '📊 *الأرقام التي اختارها المشاركون:*\n\n';
        for (const player of players) {
          numbersMsg += `• @${player.id.split('@')[0]} اختار الرمز: [ ${player.choice} ]\n`;
        }
        await sock.sendMessage(from, { text: numbersMsg, mentions: players.map(p => p.id) });

        await sleep(4000);
        // توليد رقم البوت العشوائي
        let botNumber = Math.floor(Math.random() * 101);
        await sock.sendMessage(from, { text: `🤖 *رقم الحظ العشوائي المختار من البوت هو: [ ${botNumber} ]*` });

        await sleep(2000);

        let closestPlayer = null;
        let exactMatch = null;
        let minDiff = Infinity;

        // تحديد الفائز أو الأقرب للرقم العشوائي
        for (const player of players) {
          let diff = Math.abs(player.choice - botNumber);
          if (player.choice === botNumber) {
            exactMatch = player;
          } else if (diff < minDiff) {
            minDiff = diff;
            closestPlayer = player;
          }
        }

        // خصم النقاط بناءً على النتيجة
        if (exactMatch) {
          await sock.sendMessage(from, {
            text: `🎯 *كفووو! @${exactMatch.id.split('@')[0]} طابق الرقم الحقيقي (${botNumber}) تماماً!* 🎉\n(تم خصم نقطتين من بقية اللاعبين)`,
            mentions: [exactMatch.id]
          });
          for (const player of players) {
            if (player.id !== exactMatch.id) player.points -= 2;
          }
        } else if (closestPlayer) {
          await sock.sendMessage(from, {
            text: `🔍 *أقرب رقم للنتيجة هو [ ${closestPlayer.choice} ] وصاحبه اللاعب @${closestPlayer.id.split('@')[0]}!*\n(تم خصم نقطة من بقية اللاعبين)`,
            mentions: [closestPlayer.id]
          });
          for (const player of players) {
            if (player.id !== closestPlayer.id) player.points -= 1;
          }
        }

        await sleep(2000);
        await sendPoints();

        // فحص تصفيات النقاط (من تنتهي نقاطه يطرد فوراً)
        let eliminatedPlayers = players.filter(player => player.points <= 0);
        for (const player of eliminatedPlayers) {
          await sock.groupParticipantsUpdate(from, [player.id], 'remove');
          await sock.sendMessage(from, { text: `🚫 *تم طرد @${player.id.split('@')[0]} من الساحة بسبب نفاد نقاطه (0)!*`, mentions: [player.id] });
          players = players.filter(p => p.id !== player.id);
        }

        if (players.length <= 1) break;

        await sleep(2000);
        await sock.sendMessage(from, { text: `🔄 *الاستعداد لبدء الجولة التالية [ ${round + 1} ]...*` });
        await sleep(2000);
        round++;
      }

      // الإعلان عن الفائز النهائي الصامد باللعبة
      if (players.length === 1) {
        await sock.sendMessage(from, {
          text: `🏆 *🎉 مبروك الفوز بالبطولة! الفائز الوحيد والصامد هو: @${players[0].id.split('@')[0]}!* 🏆`,
          mentions: [players[0].id]
        });
      } else {
        await sock.sendMessage(from, { text: '🏁 *انتهت اللعبة ولم يتبقى أي لاعبين صامدين في الساحة!*' });
      }

      // فتح الشات للجميع بعد انتهاء اللعبة بالكامل
      await sock.groupSettingUpdate(from, 'not_announcement');

    } catch (error) {
      console.log("خطأ في لعبة الأرقام والمقارنة:", error);
      await sock.groupSettingUpdate(from, 'not_announcement').catch(() => {});
      await sock.sendMessage(from, { text: `❌ حدث خطأ غير متوقع أثناء تشغيل اللعبة: ${error.message}` });
    }
  }
};
