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
    command: 'حرر',
    description: 'تحرير شخص من قائمة عبيدك (للنخبة فقط)',
    usage: '.حرر @شخص',
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
            return await sock.sendMessage(groupJid, { text: '❗ لازم تمنشن شخص عشان تحرره.' }, { quoted: msg });
        }

        let abidData = loadAbid();
        let myAbid = abidData[sender] || [];
        let removed = [];

        mentions.forEach(m => {
            if (myAbid.includes(m)) {
                myAbid = myAbid.filter(a => a !== m);
                removed.push(m);
            }
        });

        abidData[sender] = myAbid;
        saveAbid(abidData);

        if (removed.length > 0) {
            await sock.sendMessage(groupJid, {
                text: `✦ تم تحرير ${removed.map(m => `@${m.split('@')[0]}`).join(', ')} من عبيدك.`,
                mentions: removed
            }, { quoted: msg });
        } else {
            await sock.sendMessage(groupJid, { text: '❗ هذا الشخص مش موجود في قائمة عبيدك.' }, { quoted: msg });
        }
    }
};