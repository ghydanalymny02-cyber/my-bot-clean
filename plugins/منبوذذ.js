onst { eliteNumbers } = require('../haykala/elite.js');
const { jidDecode } = require('@whiskeysockets/baileys');
const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));
const decode = jid => (jidDecode(jid)?.user || jid.split('@')[0]) + '@s.whatsapp.net';

module.exports = {
  command: 'عبدي',
  description: 'يمنع شخصًا معينًا من الكتابة، وإذا كتب يتم طرده.',
  usage: '.عبدي @المستخدم',
  category: 'إدارة',
  async execute(sock, msg) {
    try {
      const groupJid = msg.key.remoteJid;
      const sender = decode(msg.key.participant || groupJid);
      const senderLid = sender.split('@')[0];

      if (!groupJid.endsWith('@g.us')) return await sock.sendMessage(groupJid, { text: '❗ هذا الأمر يعمل فقط داخل المجموعات.' }, { quoted: msg });

      if (!eliteNumbers.includes(senderLid)) return await sock.sendMessage(groupJid, { text: '❗ لا تملك صلاحية استخدام هذا الأمر.' }, { quoted: msg });

      const contextInfo = msg.message?.extendedTextMessage?.contextInfo;
      const mentioned = contextInfo?.mentionedJid;

      if (!mentioned || mentioned.length === 0) return await sock.sendMessage(groupJid, { text: '❗ يرجى الإشارة إلى شخص لاستخدام هذا الأمر.' }, { quoted: msg });

      const target = mentioned[0];
      const groupMetadata = await sock.groupMetadata(groupJid);
      const isAdmin = groupMetadata.participants.some(p => p.id === target && p.admin);

      if (isAdmin) return await sock.sendMessage(groupJid, { text: '❗ لا يمكنك منع مسؤول من الكتابة!' }, { quoted: msg });

      await sock.sendMessage(groupJid, { text: `🫦 <@${target.split('@')[0]}> الان انت صرت عبد عند عمك فوكس. اذا فكرت أن تكتب أي شي قبل انتهاء وقت عبوديتك سيتم طردك.`, mentions: [target] }, { quoted: msg });

      const bannedUser = target;
      const startTime = Date.now();
      let intervalId = null;

      const listener = async (msgUpdate) => {
        const msgEvent = msgUpdate.messages?.[0];

        if (!msgEvent || msgEvent.key.remoteJid !== groupJid) return;

        if (!msgEvent.key.participant.includes(bannedUser)) return;

        const remainingTime = 60000 - (Date.now() - startTime); // 1 دقيقة

        if (remainingTime <= 0) {
          clearInterval(intervalId);
          sock.ev.off('messages.upsert', listener); // أزل المستمع لتجنب التكرار

          await sock.sendMessage(groupJid, { text: `🚨 <@${bannedUser.split('@')[0]}> أوف.. يا العبد خالفت قانون عمك فوكس. مع السلامه يا عبد 🫦`, mentions: [bannedUser] });

          await sock.groupParticipantsUpdate(groupJid, [bannedUser], 'remove').catch(() => {});
        }
      };

      intervalId = setInterval(async () => {
        const remainingTime = 60000 - (Date.now() - startTime); // 1 دقيقة

        if (remainingTime <= 0) {
          clearInterval(intervalId);
          return;
        }

        const minutes = Math.floor(remainingTime / 60000);
        const seconds = Math.floor((remainingTime % 60000) / 1000);

        await sock.sendMessage(groupJid, { text: `⏰ <@${bannedUser.split('@')[0]}> يبقى ${minutes} دقيقة و ${seconds} ثانية حتى تنتهي فترة العبودية.`, mentions: [bannedUser] });
      }, 1000);

      sock.ev.on('messages.upsert', listener);
    }
  }
};
