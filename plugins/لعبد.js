const { eliteNumbers } = require('../haykala/elite.js');
const { jidDecode } = require('@whiskeysockets/baileys');
const decode = jid => (jidDecode(jid)?.user || jid.split('@')[0]) + '@s.whatsapp.net';

module.exports = {
  command: 'لعبد',
  description: 'امنشن أو رد على شخص وخليه عبد عند عمك كانيكي. أي رسالة قبل انتهاء الوقت = طرد!',
  usage: '.لعبد @المستخدم',
  category: 'ترفيه',
  
  async execute(sock, msg) {
    try {
      const groupJid = msg.key.remoteJid;
      const sender = decode(msg.key.participant || groupJid);
      const senderLid = sender.split('@')[0];

      if (!groupJid.endsWith('@g.us')) 
        return await sock.sendMessage(groupJid, { text: '❗ هذا الأمر يعمل فقط داخل المجموعات.' }, { quoted: msg });

      const groupMetadata = await sock.groupMetadata(groupJid);
      const senderIsAdmin = groupMetadata.participants.some(p => p.id === sender && p.admin);
      const senderIsElite = eliteNumbers.includes(senderLid);

      if (!senderIsAdmin && !senderIsElite)
        return await sock.sendMessage(groupJid, { text: '❗ لا تملك صلاحية استخدام هذا الأمر.' }, { quoted: msg });

      const contextInfo = msg.message?.extendedTextMessage?.contextInfo;
      const mentioned = contextInfo?.mentionedJid;
      const quoted = contextInfo?.participant;
      const target = mentioned?.[0] || quoted;

      if (!target) 
        return await sock.sendMessage(groupJid, { text: '❗ امنشن أو رد على الشخص اللي عايزه يكون عبدك 🫦.' }, { quoted: msg });

      const targetIsAdmin = groupMetadata.participants.some(p => p.id === target && p.admin);
      if (targetIsAdmin)
        return await sock.sendMessage(groupJid, { text: '❗ لا يمكنك منع مسؤول من الكتابة!' }, { quoted: msg });

      const bannedUser = target;
      let countdown = 60; // دقيقة كاملة

      // الرسالة الأولى الثابتة
      await sock.sendMessage(groupJid, {
        text: `🥀 لقد أصبحت الآن عبد عند عمك حرب (أو الادمن) 🥀 لو فكرت تكتب شئ قبل انتهاء مده تقيدك و عبوديتك سيتم طردك`,
        mentions: [bannedUser]
      });

      // رسالة العد التنازلي القابلة للتعديل
      const countdownMsg = await sock.sendMessage(groupJid, {
        text: `⏰ <@${bannedUser.split('@')[0]}> يبقى ${Math.floor(countdown/60)} دقيقة و ${countdown%60} ثانية. لا تفكر تكتب قبل انتهاء الوقت 🫦.`,
        mentions: [bannedUser]
      });

      let punished = false;

      const listener = async (newMsg) => {
        const message = newMsg.messages?.[0];
        if (!message || !message.message) return;
        const senderMsg = message.key.participant || message.key.remoteJid;
        if (senderMsg !== bannedUser) return;

        punished = true;
        clearInterval(interval);
        sock.ev.off('messages.upsert', listener);

        await sock.sendMessage(groupJid, {
          text: `🚨 <@${bannedUser.split('@')[0]}> خالف القانون وتم طرده فورًا!`,
          mentions: [bannedUser]
        });
        await sock.groupParticipantsUpdate(groupJid, [bannedUser], 'remove').catch(() => {});
      };

      sock.ev.on('messages.upsert', listener);

      const interval = setInterval(async () => {
        if (punished) return clearInterval(interval);

        countdown--;
        if (countdown <= 0) {
          clearInterval(interval);
          sock.ev.off('messages.upsert', listener);

          // رسالة تهنئة بعد انتهاء الوقت بدون مخالفات
          await sock.sendMessage(groupJid, {
            text: `🎉 <@${bannedUser.split('@')[0]}> مبروك! لقد أصبحت عبد مخلص عند عمك حرب 🥀👏.`,
            mentions: [bannedUser]
          });
          return;
        }

        try {
          await sock.sendMessage(groupJid, {
            edit: countdownMsg.key,
            text: `⏰ <@${bannedUser.split('@')[0]}> يبقى ${Math.floor(countdown/60)} دقيقة و ${countdown%60} ثانية. لا تفكر تكتب قبل انتهاء الوقت 🫦.`,
            mentions: [bannedUser]
          });
        } catch (err) {
          console.log('فشل تعديل العد التنازلي:', err);
        }
      }, 1000);

    } catch (err) {
      console.error('خطأ في أمر لعبد:', err);
      await sock.sendMessage(msg.key.remoteJid, { text: '⚠ حصل خطأ غير متوقع.' }, { quoted: msg });
    }
  }
};