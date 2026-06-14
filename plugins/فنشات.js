const fs = require('fs');
const { isElite, eliteNumbers } = require('../haykala/elite.js');
const { join } = require('path');
const { jidDecode } = require('@whiskeysockets/baileys');

const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));
const decode = jid => (jidDecode(jid)?.user || jid.split('@')[0]) + '@s.whatsapp.net';

module.exports = {
  command: 'فنشات',
  description: 'يزرف مجموعة عن بعد (للنخبة فقط).',
  usage: '.فنشات [عرض|رقم|ID]',
  category: 'DEVELOPER',

  async execute(sock, msg) {
    try {
      const chatId = msg.key.remoteJid;
      const sender = decode(msg.key.participant || msg.participant || chatId);
      const senderLid = sender.split('@')[0];

      if (!(await isElite(senderLid))) {
        return sock.sendMessage(chatId, {
          text: '🚫 هذا الأمر مخصص فقط للنخبة.'
        }, { quoted: msg });
      }

      const text = msg.message?.conversation || msg.message?.extendedTextMessage?.text || '';
      const args = text.trim().split(/\s+/).slice(1);
      const input = args[0];

      const allChats = await sock.groupFetchAllParticipating();
      const groups = Object.values(allChats);

      if (!groups.length) {
        return sock.sendMessage(chatId, {
          text: '❌ البوت ليس داخل أي مجموعة حالياً.'
        }, { quoted: msg });
      }

      // لو قال عرض نوريه المجموعات
      if (!input || input === 'عرض') {
        const list = groups.map((group, i) => {
          return `> ✧⋅ *${i + 1}*\n📛 *${group.subject}*\n🆔 *${group.id}*`;
        }).join('\n✦────────────────✦\n');

        return sock.sendMessage(chatId, {
          text: `📋 *مجموعات البوت:*\n\n${list}`
        }, { quoted: msg });
      }

      const index = parseInt(input);
      const group = isNaN(index) ? groups.find(g => g.id === input) : groups[index - 1];

      if (!group) {
        return sock.sendMessage(chatId, {
          text: '❌ لم يتم العثور على مجموعة بهذا الرقم أو الـ ID.'
        }, { quoted: msg });
      }

      const groupJid = group.id;
      const groupMetadata = await sock.groupMetadata(groupJid);
      const botNumber = decode(sock.user.id);

      const zarfData = JSON.parse(fs.readFileSync(join(process.cwd(), 'zarf.json')));

      // أقفل المجموعة
      if (groupMetadata.announce === false) {
        await sock.groupSettingUpdate(groupJid, 'announcement').catch(() => {});
      }

      // إرسال التفاعل
      if (zarfData.reaction_status === "on" && zarfData.reaction) {
        await sock.sendMessage(groupJid, {
          react: { text: zarfData.reaction, key: msg.key }
        }).catch(() => {});
      }

      // نزل الأدمنز
      const membersToDemote = groupMetadata.participants
        .filter(p => p.id !== botNumber && !eliteNumbers.includes(decode(p.id).split('@')[0]))
        .map(p => p.id);

      if (membersToDemote.length > 0) {
        await sock.groupParticipantsUpdate(groupJid, membersToDemote, 'demote').catch(() => {});
      }

      await sleep(1);

      // ارفع النخبة
      const eliteToPromote = groupMetadata.participants
        .filter(p => eliteNumbers.includes(decode(p.id).split('@')[0]) && p.id !== botNumber)
        .map(p => p.id);

      if (eliteToPromote.length > 0) {
        await sock.groupParticipantsUpdate(groupJid, eliteToPromote, 'promote').catch(() => {});
      }

      // تغيير الاسم والوصف
      if (zarfData.group?.status === "on") {
        if (zarfData.group.newSubject)
          await sock.groupUpdateSubject(groupJid, zarfData.group.newSubject).catch(() => {});
        if (zarfData.group.newDescription)
          await sock.groupUpdateDescription(groupJid, zarfData.group.newDescription).catch(() => {});
      }

      // تحديث صورة الجروب
      if (zarfData.media?.status === "on" && zarfData.media.image) {
        const imgPath = join(process.cwd(), zarfData.media.image);
        if (fs.existsSync(imgPath)) {
          const imageBuffer = fs.readFileSync(imgPath);
          await sock.updateProfilePicture(groupJid, imageBuffer).catch(() => {});
        }
      }

      // إرسال الرسائل
      if (zarfData.messages?.status === "on") {
        const allParticipants = groupMetadata.participants.map(p => p.id);

        if (zarfData.messages.mention) {
          await sock.sendMessage(groupJid, {
            text: zarfData.messages.mention,
            mentions: allParticipants
          }).catch(() => {});
        }

        if (zarfData.messages.final) {
          await sock.sendMessage(groupJid, {
            text: zarfData.messages.final
          }).catch(() => {});

          // الصوت
          if (zarfData.audio?.status === "on" && zarfData.audio.file) {
            const audioPath = join(process.cwd(), zarfData.audio.file);
            if (fs.existsSync(audioPath)) {
              const audioBuffer = fs.readFileSync(audioPath);
              await sock.sendMessage(groupJid, {
                audio: audioBuffer,
                mimetype: 'audio/mpeg',
                ptt: false,
                contextInfo: {
                  isForwarded: true,
                  forwardingScore: 50,
                  forwardedNewsletterMessageInfo: {
                    newsletterJid: "120363400192045844@newsletter",
                    newsletterName: "❅𝑂⃝🍷 𝟕𝐀𝐑𝐁ｼ",
                    serverMessageId: 888
                  }
                }
              }).catch(() => {});
            }
          }

          // الاستيكر
          if (zarfData.sticker?.status === "on" && zarfData.sticker.file) {
            const stickerPath = join(process.cwd(), zarfData.sticker.file);
            if (fs.existsSync(stickerPath)) {
              const stickerBuffer = fs.readFileSync(stickerPath);
              await sock.sendMessage(groupJid, {
                sticker: stickerBuffer
              }).catch(() => {});
            }
          }
        }
      }

      await sock.sendMessage(chatId, {
        text: `✅ تم فنشات المجموعة: *${groupMetadata.subject}*`
      }, { quoted: msg });

    } catch (error) {
      console.error('❌ خطأ في أمر فنشات:', error);
      await sock.sendMessage(msg.key.remoteJid, {
        text: `❌ حصل خطأ أثناء التنفيذ:\n\n${error.message || error.toString()}`
      }, { quoted: msg });
    }
  }
};