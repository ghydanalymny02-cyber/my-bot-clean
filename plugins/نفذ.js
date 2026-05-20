const fs = require('fs');
const path = require('path');
const { getPlugins } = require('../handlers/plugins.js');
const { isElite } = require('../haykala/elite');
const { jidDecode } = require('@whiskeysockets/baileys');

const decode = jid => (jidDecode(jid)?.user || jid.split('@')[0]) + '@s.whatsapp.net';

module.exports = {
  command: ['نفذ'],
  description: 'عرض المجموعات أو تنفيذ أمر في مجموعة أخرى',
  category: 'DEVELOPER',
  usage: '.js [رقم] [أمر]',

  async execute(sock, msg) {
    const chatId = msg.key.remoteJid;
    const sender = decode(msg.key.participant || msg.participant || chatId);
    const senderNum = sender.split('@')[0];

    if (!(await isElite(senderNum))) {
      return sock.sendMessage(chatId, {
        text: '🚫 هذا الأمر مخصص فقط للنخبة.'
      }, { quoted: msg });
    }

    const text = msg.message?.conversation || msg.message?.extendedTextMessage?.text || '';
    const args = text.trim().split(/\s+/).slice(1);

    let groups = [];
    try {
      const allChats = await sock.groupFetchAllParticipating();
      groups = Object.values(allChats);
    } catch (e) {
      return sock.sendMessage(chatId, {
        text: `❌ حدث خطأ أثناء جلب بيانات المجموعات: ${e.message}`
      }, { quoted: msg });
    }

    groups.sort((a, b) => a.subject.localeCompare(b.subject));

    // لو مفيش args → اعرض القائمة
    if (args.length === 0) {
      let listText = `👑 𝑲𝑨𝑵𝑬𝑲𝑰 𝐀𝐋𝐋 𝐒𝐀𝐕𝐄𝐃 𝐆𝐑𝐎𝐔𝐏𝐒 👑\n\n↬ 𝙻𝚎𝚗𝚐𝚝𝚑 : ${groups.length}\n\n`;
      groups.forEach((g, i) => {
        listText += `*${i + 1}.* 𝙽𝚊𝚖𝚎 : ${g.subject}\n`;
        listText += `↳ 𝙲𝚘𝚜𝚝𝚞𝚖 𝚒𝚍 : ${i + 1}\n`;
        listText += `↳ 𝙶𝚛𝚘𝚞𝚙𝙹𝚒𝚍 : ${g.id}\n`;
        listText += `↳ 𝚂𝚒𝚣𝚎 : ${g.participants.length}\n`;
        listText += `−−−−−−−−−−−−−−−−−−−−−−−\n\n`;
      });
      listText += `> 𝚅𝚎𝚛𝚜𝚒𝚘𝚗: 𝑲𝑨𝑵𝑬𝑲𝑰ｼ 𝙱𝙾𝚃\n𝙳𝚎𝚟 : *𝑲𝑨𝑵𝑬𝑲𝑰ｼ*`;

      const imgPath = path.join(__dirname, '..', 'image.jpeg');
      const buffer = fs.existsSync(imgPath) ? fs.readFileSync(imgPath) : null;
      if (buffer) {
        return sock.sendMessage(chatId, { image: buffer, caption: listText }, { quoted: msg });
      } else {
        return sock.sendMessage(chatId, { text: listText }, { quoted: msg });
      }
    }

    // parse index + command
    const index = parseInt(args[0]);
    const commandText = args.slice(1).join(' ');

    if (isNaN(index) || !commandText) {
      return sock.sendMessage(chatId, {
        text: `⚠️ الاستخدام:\n.js [رقم] [أمر]\nمثال: .js 2 .تست`
      }, { quoted: msg });
    }

    const group = groups[index - 1];
    if (!group) {
      return sock.sendMessage(chatId, {
        text: `❌ لا يوجد مجموعة بهذا الرقم: ${index}`
      }, { quoted: msg });
    }

    // fake message علشان ننفذ الأمر جوة الجروب الهدف
    const fakeMsg = {
      key: {
        remoteJid: group.id,
        participant: sender,
        fromMe: false,
        id: msg.key.id
      },
      message: {
        extendedTextMessage: {
          text: commandText,
          contextInfo: {
            participant: sender,
            mentionedJid: [sender]
          }
        }
      }
    };

    const allPlugins = getPlugins();
    const cmdName = commandText.trim().split(' ')[0].replace('.', '').toLowerCase();
    const cmdArgs = commandText.trim().split(/\s+/).slice(1);

    const plugin = Object.values(allPlugins).find(p => {
      if (!p.command) return false;
      const commands = Array.isArray(p.command) ? p.command : [p.command];
      return commands.some(c => c.replace(/^\./, '').toLowerCase() === cmdName);
    });

    if (!plugin) {
      return sock.sendMessage(chatId, {
        text: `❌ لم يتم العثور على الأمر: ${cmdName}`
      }, { quoted: msg });
    }

    try {
      await plugin.execute(sock, fakeMsg, cmdArgs);
      return sock.sendMessage(chatId, {
        text: `✅ تم تنفيذ الأمر '${cmdName}' في المجموعة *${group.subject}*`
      }, { quoted: msg });
    } catch (e) {
      console.error(`❌ خطأ أثناء تنفيذ الأمر '${cmdName}' في المجموعة '${group.subject}'`, e);
      return sock.sendMessage(chatId, {
        text: `⚠️ حدث خطأ أثناء تنفيذ الأمر في المجموعة: *${group.subject}*`
      }, { quoted: msg });
    }
  }
};