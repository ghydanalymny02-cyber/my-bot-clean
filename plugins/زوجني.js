const fs = require('fs');
const path = require('path');

const zawajFile = path.join(process.cwd(), 'zawaj.json');

// تحميل البيانات
function loadZawaj() {
    if (!fs.existsSync(zawajFile)) fs.writeFileSync(zawajFile, JSON.stringify([]));
    return JSON.parse(fs.readFileSync(zawajFile));
}

// حفظ البيانات
function saveZawaj(data) {
    fs.writeFileSync(zawajFile, JSON.stringify(data, null, 2));
}

module.exports = {
    command: 'زوجني',
    description: 'تزويج نفسك بعروس عشوائية ومأذون عشوائي',
    category: 'fun',

    async execute(sock, msg) {
        const groupJid = msg.key.remoteJid;
        const sender = msg.key.participant || msg.participant || msg.key.remoteJid;

        // جلب أعضاء المجموعة
        const metadata = await sock.groupMetadata(groupJid);
        const participants = metadata.participants.map(p => p.id);

        // اختيار عروس عشوائية غير العريس
        let bride = participants.filter(p => p !== sender)[Math.floor(Math.random() * (participants.length - 1))];

        // اختيار مأذون عشوائي غير العريس والعروس
        let others = participants.filter(p => p !== sender && p !== bride);
        let maazoun = others[Math.floor(Math.random() * others.length)];

        // إضافة الزواج في الملف
        let zawajData = loadZawaj();
        zawajData.push({
            groom: sender,
            bride: bride,
            maazoun: maazoun
        });
        saveZawaj(zawajData);

        // رسالة تأكيد
        await sock.sendMessage(groupJid, {
            text: `💍 تم الزواج!\n\n👑 العريس: @${sender.split('@')[0]}\n👰 العروسة: @${bride.split('@')[0]}\n📜 المأذون: @${maazoun.split('@')[0]}`,
            mentions: [sender, bride, maazoun]
        }, { quoted: msg });
    }
};