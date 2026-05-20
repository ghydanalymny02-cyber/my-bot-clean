const fs = require('fs');
const { join } = require('path');
const { eliteNumbers } = require('../haykala/elite.js');

const abidFile = join(process.cwd(), 'abid.json');

function loadAbid() {
    if (!fs.existsSync(abidFile)) fs.writeFileSync(abidFile, JSON.stringify({}));
    return JSON.parse(fs.readFileSync(abidFile));
}

module.exports = {
    command: 'عبيدي',
    description: 'عرض قائمة عبيدك (للنخبة فقط)',
    usage: '.عبيدي',
    category: 'fun',

    async execute(sock, msg) {
        const groupJid = msg.key.remoteJid;
        const sender = msg.key.participant || msg.participant || msg.key.remoteJid;
        const senderId = sender.split('@')[0];

        if (!eliteNumbers.includes(senderId)) {
            return await sock.sendMessage(groupJid, { text: '❗ هذا الأمر خاص بالنخبة فقط.' }, { quoted: msg });
        }

        let abidData = loadAbid();
        let myAbid = abidData[sender] || [];

        if (myAbid.length === 0) {
            return await sock.sendMessage(groupJid, { text: '✦ ما عندك أي عبيد للحين.' }, { quoted: msg });
        }

        await sock.sendMessage(groupJid, {
            text: `✦ عبيدك:\n\n${myAbid.map((m, i) => `${i + 1}. @${m.split('@')[0]}`).join('\n')}`,
            mentions: myAbid
        }, { quoted: msg });
    }
};