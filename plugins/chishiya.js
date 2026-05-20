const promiseTimeout = (ms, promise) => {
  return Promise.race([
    promise,
    new Promise((_, reject) => setTimeout(() => reject(new Error('Timed Out')), ms))
  ]);
};

export default {
  name: 'لعبة',
  command: ['أرقام'],
  category: 'ألعاب',
  description: 'لعبة اختيار الأرقام ومقارنة النتائج',
  args: [],
  execution: async ({ sock, m, sleep }) => {
    if (!m.key.remoteJid.endsWith('@g.us')) {
      return sock.sendMessage(m.key.remoteJid, { text: 'هذا الأمر يعمل فقط داخل المجموعات.' });
    }

    const groupMetadata = await sock.groupMetadata(m.key.remoteJid);
    const participants = groupMetadata.participants;
    const admins = participants.filter(p => p.admin).map(p => p.id);

    let players = participants
      .filter(p => !admins.includes(p.id))
      .map(p => ({ id: p.id, points: 10, choice: null }));

    if (players.length < 2) {
      return sock.sendMessage(m.key.remoteJid, { text: 'يجب أن يكون هناك على الأقل لاعبان غير مشرفين لبدء اللعبة.' });
    }

    await sleep(3000);
    await sock.sendMessage(m.key.remoteJid, { text: '*اللعبة بدأت!*' });

    await sleep(5000);
    await sock.groupSettingUpdate(m.key.remoteJid, 'announcement');
    await sock.groupRevokeInvite(m.key.remoteJid);
    await sock.sendMessage(m.key.remoteJid, { text: '*تم تغيير رابط المجموعة وإغلاقها!*' });

    const sendPoints = async () => {
      let msg = `*نقاط الأعضاء الحاليين:*\n\n`;
      for (const player of players) {
        msg += `@${player.id.split('@')[0]} : ${player.points} نقاط\n`;
      }
      await sock.sendMessage(m.key.remoteJid, { text: msg, mentions: players.map(p => p.id) });
    };

    await sendPoints();
    let round = 1;

    while (players.length > 1) {
      await sleep(3000);
      await sock.sendMessage(m.key.remoteJid, {
        text: `[*الجولة ${round} :*]\nاختر رقمًا بين 0 و 100..\n❗ أي رسالة غير رقمية تؤدي إلى الطرد فورًا..\n⏳ لديك 30 ثانية للاختيار..`
      });

      await sock.groupSettingUpdate(m.key.remoteJid, 'not_announcement');

      let choices = {};
      const messageListener = async (chatUpdate) => {
        const message = chatUpdate.messages[0];
        const sender = message.key.participant || message.key.remoteJid;

        if (!players.some(p => p.id === sender) || !message.message) return;

        const text = message.message.conversation?.trim();

        if (!/^\d+$/.test(text)) {
          await sock.groupParticipantsUpdate(m.key.remoteJid, [sender], 'remove');
          await sock.sendMessage(m.key.remoteJid, { text: `🚫 *تم طرد @${sender.split('@')[0]} لإرسال رسالة غير رقم!*`, mentions: [sender] });

          players = players.filter(p => p.id !== sender);
        } else {
          choices[sender] = parseInt(text);
        }
      };

      sock.ev.on('messages.upsert', messageListener);

      let countdownMsg = await sock.sendMessage(m.key.remoteJid, { text: '*⏰:30*' });
      for (let i = 29; i >= 0; i--) {
        await sleep(1000);
        await sock.sendMessage(m.key.remoteJid, { text: `*⏰:${i < 10 ? '0' : ''}${i}*`, edit: countdownMsg.key });
      }

      sock.ev.off('messages.upsert', messageListener);
      await sleep(2000);

      await sock.groupSettingUpdate(m.key.remoteJid, 'announcement');
      await sock.sendMessage(m.key.remoteJid, { text: '*⏳ انتهى الوقت!*' });

      for (const player of players) {
        player.choice = choices[player.id] !== undefined ? choices[player.id] : 0;
      }

      let numbersMsg = '*📊 الأرقام التي اختارها المشاركون:*\n\n';
      let displayMsg = await sock.sendMessage(m.key.remoteJid, { text: '' });

      for (const player of players) {
        numbersMsg += `@${player.id.split('@')[0]} : ${player.choice}\n`;
        await sleep(350);
        await sock.sendMessage(m.key.remoteJid, { text: numbersMsg, edit: displayMsg.key });
      }

      await sleep(4000);
      let botNumber = Math.floor(Math.random() * 101);
      await sock.sendMessage(m.key.remoteJid, { text: `🤖 *الرقم العشوائي الذي اختاره البوت هو: ${botNumber}*` });

      await sleep(2000);

      let closestPlayer = null;
      let exactMatch = null;
      let minDiff = Infinity;

      for (const player of players) {
        let diff = Math.abs(player.choice - botNumber);
        if (player.choice === botNumber) {
          exactMatch = player;
        } else if (diff < minDiff) {
          minDiff = diff;
          closestPlayer = player;
        }
      }

      if (exactMatch) {
        await sock.sendMessage(m.key.remoteJid, {
          text: `🎯 *@${exactMatch.id.split('@')[0]} طابق الرقم (${botNumber}) تمامًا!* 🎉`,
          mentions: [exactMatch.id]
        });

        for (const player of players) {
          if (player !== exactMatch) player.points -= 2;
        }
      } else if (closestPlayer) {
        await sock.sendMessage(m.key.remoteJid, {
          text: `🔍 *أقرب رقم للنتيجة هو ${closestPlayer.choice} من اللاعب @${closestPlayer.id.split('@')[0]}!*`,
          mentions: [closestPlayer.id]
        });

        for (const player of players) {
          if (player !== closestPlayer) player.points -= 1;
        }
      }

      await sleep(2000);
      await sendPoints();

      let eliminatedPlayers = players.filter(player => player.points <= 0);
      for (const player of eliminatedPlayers) {
        await sock.groupParticipantsUpdate(m.key.remoteJid, [player.id], 'remove');
        await sock.sendMessage(m.key.remoteJid, { text: `🚫 *تم طرد @${player.id.split('@')[0]} بسبب انتهاء نقاطه!*`, mentions: [player.id] });

        players = players.filter(p => p.id !== player.id);
      }

      await sleep(2000);
      await sock.sendMessage(m.key.remoteJid, { text: `🔄 *بدء الجولة ${round + 1}...*` });
      await sleep(2000);
      round++;
    }

    if (players.length === 1) {
      await sock.sendMessage(m.key.remoteJid, {
        text: `🏆 *🎉 مبروك! الفائز هو @${players[0].id.split('@')[0]}!* 🏆`,
        mentions: [players[0].id]
      });
    }

    await sock.groupSettingUpdate(m.key.remoteJid, 'not_announcement');
  },
  hidden: false,
};