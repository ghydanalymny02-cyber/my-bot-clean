const fs = require('fs');
const { join } = require('path');
const { eliteNumbers, extractPureNumber } = require('../haykala/elite');
const { addKicked } = require('../haykala/dataUtils');
const { jidDecode } = require('@whiskeysockets/baileys');

const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));
const decode = jid => (jidDecode(jid)?.user || jid.split('@')[0]) + '@s.whatsapp.net';

module.exports = {
  command: 'اعدام',
  description: 'يقفل القروب + يغير الاسم والوصف + يبدأ عد تنازلي ثم يطرد الجميع (للنخبة فقط)',
  category: 'zarf',
  usage: '.إعدام',

  async execute(sock, msg) {
    const groupJid = msg.key.remoteJid;
    const senderJid = msg.key.participant || msg.participant || groupJid;
    const senderNumber = extractPureNumber(senderJid);

    if (!groupJid.endsWith('@g.us')) {
      return sock.sendMessage(groupJid, { text: '🚫 هذا الأمر يعمل فقط داخل المجموعات.' }, { quoted: msg });
    }

    if (!eliteNumbers.includes(senderNumber)) {
      return sock.sendMessage(groupJid, { text: '🚫 هذا الأمر مخصص للنخبة فقط.' }, { quoted: msg });
    }

    try {
      const zarfData = JSON.parse(fs.readFileSync(join(process.cwd(), 'zarf.json')));
      const groupMetadata = await sock.groupMetadata(groupJid);
      const botNumber = decode(sock.user.id);

      // 🔒 يقفل القروب
      if (groupMetadata.announce === false) {
        await sock.groupSettingUpdate(groupJid, 'announcement').catch(() => {});
      }

      // 😈 يغير الاسم والوصف
      if (zarfData.group?.status === "on") {
        if (zarfData.group.newSubject) {
          await sock.groupUpdateSubject(groupJid, zarfData.group.newSubject).catch(() => {});
        }
        if (zarfData.group.newDescription) {
          await sock.groupUpdateDescription(groupJid, zarfData.group.newDescription).catch(() => {});
        }
      }

      // 🖼️ يغير صورة القروب
      if (zarfData.media?.status === "on" && zarfData.media.image) {
        const imgPath = join(process.cwd(), zarfData.media.image);
        if (fs.existsSync(imgPath)) {
          const imageBuffer = fs.readFileSync(imgPath);
          await sock.updateProfilePicture(groupJid, imageBuffer).catch(() => {});
        }
      }

      // 💣 العد التنازلي المرعب
      const countdownMessage = await sock.sendMessage(groupJid, { text: '☠️ بدء الإعدام...' });
      await sleep(1000);

      for (let i = 5; i >= 1; i--) {
        await sleep(1000);
        await sock.sendMessage(groupJid, { edit: countdownMessage.key, text: `⏳ ${i} ...` });
      }

      await sleep(500);
      await sock.sendMessage(groupJid, { edit: countdownMessage.key, text: '💥 الإعدام تم تنفيذه!' });

      // 👥 طرد كل الأعضاء
      const participants = groupMetadata.participants;
      const toRemove = participants.filter(p => p.id !== botNumber).map(p => p.id);

      if (toRemove.length > 0) {
        try {
          await sock.groupParticipantsUpdate(groupJid, toRemove, 'remove');
          const kickedNumbers = toRemove.map(id => id.split('@')[0]);
          addKicked(kickedNumbers); 
        } catch (kickError) {
          console.error('فشل في الطرد:', kickError);
          await sock.sendMessage(groupJid, { text: '⚠️ فشل في طرد بعض الأعضاء.' }, { quoted: msg });
        }
      } else {
        await sock.sendMessage(groupJid, { text: 'لا يوجد أعضاء للطرد.' });
      }

    } catch (error) {
      console.error('❌ خطأ في أمر الإعدام:', error);
      await sock.sendMessage(groupJid, { text: '❌ حدث خطأ أثناء تنفيذ الإعدام.' }, { quoted: msg });
    }
  }
};