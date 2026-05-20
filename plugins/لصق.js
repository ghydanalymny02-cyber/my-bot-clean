const fs = require('fs');
const path = require('path');
const { jidDecode } = require('@whiskeysockets/baileys');
const { isElite } = require('../haykala/elite.js');

const decode = jid => (jidDecode(jid)?.user || jid.split('@')[0]) + '@s.whatsapp.net';

const dataDir = path.join(__dirname, '..', 'data');
const backupFile = path.join(dataDir, 'groupBackups.json');

if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true });
if (!fs.existsSync(backupFile)) fs.writeFileSync(backupFile, JSON.stringify({}, null, 2));

module.exports = {
    command: 'لصق',
    description: 'إضافة نسخة من الأعضاء المحفوظة للمجموعة.',
    usage: '.لصق [اسم_النسخة]',

    async execute(sock, msg) {
        const groupJid = msg.key.remoteJid;
        const sender = decode(msg.key.participant || groupJid);
        const senderLid = sender.split('@')[0];

        if (!groupJid.endsWith('@g.us')) return;
        if (!isElite(senderLid)) return;

        let text = msg.body || msg.message?.conversation || msg.message?.extendedTextMessage?.text || "";
        text = text.trim();
        const parts = text.split(/\s+/);
        const backupName = parts.slice(1).join(' ');

        if (!backupName) 
            return sock.sendMessage(groupJid, { text: '❌ يجب كتابة اسم النسخة.\nمثال: .لصق نسخة1' }, { quoted: msg });

        let backups = JSON.parse(fs.readFileSync(backupFile));
        if (!backups[backupName]) 
            return sock.sendMessage(groupJid, { text: `❌ لا توجد نسخة محفوظة باسم: *${backupName}*` }, { quoted: msg });

        const contacts = backups[backupName];

        // تحويل كل رقم إلى JID صالح
        const jidsToAdd = contacts.map(c => {
            const phone = c.vcard.match(/waid=(\d+)/)[1];
            return `${phone}@s.whatsapp.net`;
        });

        let addedCount = 0;
        const batchSize = 2; // شخصين في كل دفعة
        for (let i = 0; i < jidsToAdd.length; i += batchSize) {
            const batch = jidsToAdd.slice(i, i + batchSize);
            try {
                await sock.groupParticipantsUpdate(groupJid, batch, 'add');
                addedCount += batch.length;
                console.log(`✅ تمت إضافة: ${batch.join(', ')}`);
            } catch (e) {
                console.log(`❌ فشل في إضافة الدفعة: ${batch.join(', ')}`, e.message);
            }
            // انتظر 5 ثواني قبل الدفعة التالية
            await new Promise(r => setTimeout(r, 5000));
        }

        return sock.sendMessage(groupJid, { text: `✅ تم إضافة ${addedCount} عضو من النسخة: *${backupName}*` }, { quoted: msg });
    }
};

//اذا تعدل ممكن البوت يسوي loged out 🐧