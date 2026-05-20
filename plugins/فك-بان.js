const fs = require('fs');
const path = require('path');
const { eliteNumbers, extractPureNumber } = require('../haykala/elite');
const { jidDecode } = require('@whiskeysockets/baileys');

const bannedFile = path.join(__dirname, '..', 'data', 'banned.json');

function loadBanned() {
  return JSON.parse(fs.readFileSync(bannedFile));
}

function saveBanned(list) {
  fs.writeFileSync(bannedFile, JSON.stringify(list, null, 2));
}

const decode = jid => (jidDecode(jid)?.user || jid.split('@')[0]) + '@s.whatsapp.net';

module.exports = {
  command: 'فك-بان',
  description: '✅ فك الحظر عن رقم (عن طريق المنشن أو الرد أو كتابة الرقم مباشرة)',
  usage: '.فك-بان + منشن أو رد أو رقم',
  category: 'DEVELOPER',

  async execute(sock, msg) {
    const sender = decode(msg.key.participant || msg.key.remoteJid);
    const senderNumber = extractPureNumber(sender);

    if (!eliteNumbers.includes(senderNumber)) {
      return sock.sendMessage(msg.key.remoteJid, {
        text: '🚫 هذا الأمر مخصص للنخبة فقط!',
      }, { quoted: msg });
    }

    // 1️⃣ نحاول نجيب الرقم من المنشن
    const mentionedJid = msg.message?.extendedTextMessage?.contextInfo?.mentionedJid?.[0];

    // 2️⃣ لو فيه رد على رسالة
    const quotedJid = msg.message?.extendedTextMessage?.contextInfo?.participant;

    // 3️⃣ لو المستخدم كتب الرقم مباشرة بعد الأمر
    const args = (msg.message?.conversation || msg.message?.extendedTextMessage?.text || '').split(' ').slice(1);
    const typedNumber = args[0] ? args[0].replace(/[^0-9]/g, '') : null;

    const targetNumber = mentionedJid
      ? extractPureNumber(mentionedJid)
      : quotedJid
        ? extractPureNumber(quotedJid)
        : typedNumber;

    if (!targetNumber) {
      return sock.sendMessage(msg.key.remoteJid, {
        text: '❌ لازم تعمل منشن أو ترد أو تكتب الرقم اللي عايز تفك الحظر عنه.',
      }, { quoted: msg });
    }

    let banned = loadBanned();

    if (!banned.includes(targetNumber)) {
      return sock.sendMessage(msg.key.remoteJid, {
        text: `⚠️ الرقم ${targetNumber} مش محظور أصلاً.`,
      }, { quoted: msg });
    }

    banned = banned.filter(num => num !== targetNumber);
    saveBanned(banned);

    await sock.sendMessage(msg.key.remoteJid, {
      text: `✅ تم فك الحظر عن الرقم: ${targetNumber}`,
    }, { quoted: msg });
  }
};