const fs = require('fs');
const { join } = require('path');
const { eliteNumbers, extractPureNumber } = require('../haykala/elite');
const { jidDecode } = require('@whiskeysockets/baileys');

const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));
const decode = jid => (jidDecode(jid)?.user || jid.split('@')[0]) + '@s.whatsapp.net';

module.exports = {
  command: 'وداعا',
  description: 'ابدأ عد تنازلي لطرد عضو بعد انتهاء العد (للنخبة فقط)',
  category: 'zarf',
  usage: '.وداعا @العضو [عدد الثواني]',

  async execute(sock, msg, args = []) {
    const chatId = msg.key.remoteJid;
    const senderJid = msg.key.participant || msg.participant || chatId;
    const senderNumber = extractPureNumber(senderJid);

    if (!chatId.endsWith('@g.us')) {
      return sock.sendMessage(chatId, { text: '🚫 هذا الأمر يعمل فقط داخل المجموعات.' }, { quoted: msg });
    }
    if (!eliteNumbers.includes(senderNumber)) {
      return sock.sendMessage(chatId, { text: '🚫 هذا الأمر مخصص للنخبة فقط.' }, { quoted: msg });
    }

    const mentioned = msg.message?.extendedTextMessage?.contextInfo?.mentionedJid;
    if (!mentioned || mentioned.length === 0) {
      return sock.sendMessage(chatId, { text: '*【منشن الشخص الذي تريد توديع♟️】*' }, { quoted: msg });
    }
    const target = mentioned[0];
    const targetNumber = extractPureNumber(target);
    const startNumber = parseInt(args[1]) || 5;

    let countdownMessage = await sock.sendMessage(chatId, {
      text: `قل آخر كلماتك @${target.split('@')[0]} ${startNumber}`,
      mentions: [target]
    }, { quoted: msg });

    // عد تنازلي متسلسل
    for (let counter = startNumber - 1; counter >= 0; counter--) {
      await sleep(1000);
      try {
        await sock.sendMessage(chatId, {
          edit: countdownMessage.key,
          text: counter > 0 
            ? `قل آخر كلماتك @${target.split('@')[0]} ${counter}`
            : `💥 انتهى العد!`,
          mentions: [target]
        });
      } catch (err) {
        console.error('فشل تعديل الرسالة:', err.message);
      }
    }

    // استخدام طريقة الطرد مع حماية النخبة
    try {
      const groupMetadata = await sock.groupMetadata(chatId);
      const botJid = decode(sock.user.id);
      const member = groupMetadata.participants.find(p => p.id === target);

      if (!member) {
        return sock.sendMessage(chatId, { text: `❌ العضو @${target.split('@')[0]} غير موجود بالجروب.`, mentions: [target] });
      }

      // حماية النخبة
      if (eliteNumbers.includes(targetNumber)) {
        return sock.sendMessage(chatId, { text: `❌ لا يمكن طرد النخبة.`, mentions: [target] });
      }

      if (target === botJid) {
        return sock.sendMessage(chatId, { text: '❌ لا يمكن طرد البوت نفسه.', mentions: [target] });
      }

      await sock.groupParticipantsUpdate(chatId, [target], 'remove');
      await sock.sendMessage(chatId, { 
        text: `💥 تم طرد @${target.split('@')[0]} بعد انتهاء العد!`, 
        mentions: [target] 
      });

    } catch (err) {
      console.error('فشل طرد العضو:', err.message);
      await sock.sendMessage(chatId, { 
        text: `⚠️ فشل طرد @${target.split('@')[0]}: ${err.message}`, 
        mentions: [target] 
      });
    }
  }
};