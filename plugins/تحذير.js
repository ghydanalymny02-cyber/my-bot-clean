const fs = require('fs');
const path = require('path');
const { isElite } = require('../haykala/elite');

const warningsFile = path.join(__dirname, '../data/warnings.json');
if (!fs.existsSync(warningsFile)) fs.writeFileSync(warningsFile, '{}');
let warnings = JSON.parse(fs.readFileSync(warningsFile));

function saveWarnings() { fs.writeFileSync(warningsFile, JSON.stringify(warnings, null, 2)); }

module.exports = {
    command: 'تحذير',
    category: 'admin',
    description: 'يعطي تحذير لعضو وإذا وصل لـ 3 يتم طرده تلقائيًا.',
    usage: '.تحذير @العضو',
    group: true,
    async execute(sock, msg) {
        const chatId = msg.key.remoteJid;
        const sender = msg.key.participant || msg.key.remoteJid;

        if (!(await isElite(sender))) {
            return sock.sendMessage(chatId, { text: '❌ هذا الأمر مخصص للمشرفين فقط.' }, { quoted: msg });
        }

        const reply = msg.message?.extendedTextMessage?.contextInfo?.participant;
        const mentions = msg.message?.extendedTextMessage?.contextInfo?.mentionedJid || [];
        const targetJid = reply || mentions[0];

        if (!targetJid) {
            return sock.sendMessage(chatId, { text: '❌ من فضلك منشن عضو أو رد على رسالته لإعطائه تحذير.' }, { quoted: msg });
        }

        if (!warnings[chatId]) warnings[chatId] = {};
        if (!warnings[chatId][targetJid]) warnings[chatId][targetJid] = 0;

        warnings[chatId][targetJid]++;
        saveWarnings();

        const userWarnings = warnings[chatId][targetJid];

        if (userWarnings >= 3) {
            await sock.groupParticipantsUpdate(chatId, [targetJid], 'remove');
            delete warnings[chatId][targetJid];
            saveWarnings();

            return sock.sendMessage(chatId, {
                text: `❌ تم طرد @${targetJid.split('@')[0]} بعد حصوله على 3 تحذيرات!`,
                mentions: [targetJid]
            }, { quoted: msg });
        }

        await sock.sendMessage(chatId, {
            text: `⚠️ تم إعطاء @${targetJid.split('@')[0]} تحذير (${userWarnings}/3).`,
            mentions: [targetJid]
        }, { quoted: msg });
    }
};