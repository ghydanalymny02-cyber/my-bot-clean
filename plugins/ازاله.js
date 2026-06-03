const fs = require('fs');
const path = require('path');

const WARN_FILE = path.join(__dirname, '..', 'data', 'warns.json');

const loadWarns = () => fs.existsSync(WARN_FILE) ? JSON.parse(fs.readFileSync(WARN_FILE)) : {};
const saveWarns = (data) => fs.writeFileSync(WARN_FILE, JSON.stringify(data, null, 2));

module.exports = {
    command: 'ازاله',
    description: 'إزالة تحذير واحد من عضو معين.',
    usage: '.ازاله @منشن',
    category: 'admin',
    async execute(sock, msg) {
        const groupJid = msg.key.remoteJid;
        const sender = msg.participant || msg.key.participant || msg.key.remoteJid;

        if (!groupJid.endsWith('@g.us')) {
            return sock.sendMessage(groupJid, { text: '❌ هذا الأمر يعمل فقط في المجموعات.' }, { quoted: msg });
        }

        const metadata = await sock.groupMetadata(groupJid);
        const admins = metadata.participants.filter(p => p.admin);
        const isAdmin = admins.find(p => p.id === sender);

        if (!isAdmin) {
            return sock.sendMessage(groupJid, { text: '❌ هذا الأمر للمشرفين فقط.' }, { quoted: msg });
        }

        const reply = msg.message?.extendedTextMessage?.contextInfo?.participant;
        const mentions = msg.message?.extendedTextMessage?.contextInfo?.mentionedJid || [];
        const targetJid = reply || mentions[0];

        if (!targetJid) {
            return sock.sendMessage(groupJid, { text: '❌ يجب منشن العضو أو الرد على رسالته لإزالة التحذير.' }, { quoted: msg });
        }

        const warns = loadWarns();
        if (!warns[groupJid] || !warns[groupJid][targetJid]) {
            return sock.sendMessage(groupJid, { text: `⚠️ @${targetJid.split('@')[0]} ليس لديه تحذيرات.`, mentions: [targetJid] }, { quoted: msg });
        }

        warns[groupJid][targetJid] -= 1;
        if (warns[groupJid][targetJid] <= 0) delete warns[groupJid][targetJid];
        saveWarns(warns);

        await sock.sendMessage(groupJid, {
            text: `✅ تم إزالة تحذير من @${targetJid.split('@')[0]}.\nعدد التحذيرات الحالي: ${warns[groupJid][targetJid] || 0}/3`,
            mentions: [targetJid]
        }, { quoted: msg });
    }
};