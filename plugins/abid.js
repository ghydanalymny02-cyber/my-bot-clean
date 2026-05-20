const fs = require('fs');
const { join } = require('path');
const { eliteNumbers } = require('../haykala/elite.js');

const abidFile = join(process.cwd(), 'abid.json');

function loadAbid() {
    if (!fs.existsSync(abidFile)) fs.writeFileSync(abidFile, JSON.stringify({}));
    return JSON.parse(fs.readFileSync(abidFile));
}
function saveAbid(data) {
    fs.writeFileSync(abidFile, JSON.stringify(data, null, 2));
}

module.exports = {
    command: 'عبد',
    description: 'إضافة شخص إلى قائمة عبيدك (للنخبة فقط)',
    usage: '.عبد @شخص',
    category: 'fun',

    async execute(sock, msg) {
        const groupJid = msg.key.remoteJid;
        const sender = msg.key.participant || msg.participant || msg.key.remoteJid;
        const senderId = sender.split('@')[0];

        if (!eliteNumbers.includes(senderId)) {
            return await sock.sendMessage(groupJid, { text: '❗ هذا الأمر خاص بالنخبة فقط.' }, { quoted: msg });
        }

        const mentions = msg.message?.extendedTextMessage?.contextInfo?.mentionedJid || [];

        if (mentions.length === 0) {
            return await sock.sendMessage(groupJid, { text: '❗ لازم تمنشن شخص عشان تضيفه عبد.' }, { quoted: msg });
        }

        let abidData = loadAbid();
        if (!abidData[sender]) abidData[sender] = [];

        mentions.forEach(m => {
            if (!abidData[sender].includes(m)) {
                abidData[sender].push(m);
            }
        });

        saveAbid(abidData);

        await sock.sendMessage(groupJid, {
            text: `✦ تمت إضافة ${mentions.map(m => `@${m.split('@')[0]}`).join(', ')} إلى عبيدك.`,
            mentions
        }, { quoted: msg });
    }
};