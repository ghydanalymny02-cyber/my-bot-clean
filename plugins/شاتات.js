const fs = require('fs');
const path = require('path');
const { eliteNumbers } = require('../haykala/elite.js');
const { getPlugins } = require('../handlers/plugins.js');
const { jidDecode } = require('@whiskeysockets/baileys');

const blockedGroupsFile = path.join(__dirname, '..', 'data', 'blockedGroups.json');
if (!fs.existsSync(blockedGroupsFile)) fs.writeFileSync(blockedGroupsFile, JSON.stringify([]));

const decode = jid => (jidDecode(jid)?.user || jid.split('@')[0]) + '@s.whatsapp.net';

function loadBlockedGroups() {
    try {
        return JSON.parse(fs.readFileSync(blockedGroupsFile, 'utf8'));
    } catch {
        return [];
    }
}

module.exports = {
    command: 'شاتات',
    description: '📜 عرض الجروبات المتبندة مع تنفيذ أي أمر عليها للنخبة',
    usage: '.شاتات',
    category: 'DEVELOPER',
    group: true,

    async execute(sock, msg) {
        const chatId = msg.key.remoteJid;
        const sender = decode(msg.key.participant || chatId);
        const senderLid = sender.split('@')[0];

        if (!eliteNumbers.includes(senderLid)) {
            return sock.sendMessage(chatId, { text: '❗ لا تملك صلاحية استخدام هذا الأمر.' }, { quoted: msg });
        }

        if (!chatId.endsWith('@g.us')) {
            return sock.sendMessage(chatId, { text: '❌ هذا الأمر يعمل فقط داخل الجروبات.' }, { quoted: msg });
        }

        const blockedGroups = loadBlockedGroups();
        if (!blockedGroups.length) {
            return sock.sendMessage(chatId, { text: '🎉 مفيش جروبات متبندة دلوقتي!' }, { quoted: msg });
        }

        // قسم الرسالة إلى args
        const text = msg.message?.conversation || msg.message?.extendedTextMessage?.text || '';
        const input = text.trim().split(' ').slice(1);
        const indexOrCommand = input[0];
        const commandText = input.slice(1).join(' ');

        // لو مفيش رقم، اعرض القائمة بس
        if (!indexOrCommand || indexOrCommand.toLowerCase() === 'عرض') {
            let listText = '📜 قائمة الجروبات المتبندة:\n\n';
            for (let i = 0; i < blockedGroups.length; i++) {
                try {
                    const metadata = await sock.groupMetadata(blockedGroups[i]);
                    listText += `${i + 1}. ${metadata.subject} | ${blockedGroups[i]}\n`;
                } catch {
                    listText += `${i + 1}. غير معروف | ${blockedGroups[i]}\n`;
                }
            }
            listText += `\n⚡ لتنفيذ أمر: .شاتات [رقم الجروب] [الأمر]\nمثال: .شاتات 2 ,ادمن`;
            return sock.sendMessage(chatId, { text: listText }, { quoted: msg });
        }

        // تنفيذ أمر
        const index = parseInt(indexOrCommand);
        if (isNaN(index) || index < 1 || index > blockedGroups.length || !commandText) {
            return sock.sendMessage(chatId, { text: '⚠️ استخدم: .شاتات [رقم] [الأمر]\nمثال: .شاتات 2 ,ادمن' }, { quoted: msg });
        }

        const groupId = blockedGroups[index - 1];

        const contextInfo = msg.message?.extendedTextMessage?.contextInfo || {};
        const fakeMsg = {
            key: { remoteJid: groupId, participant: sender, fromMe: false, id: msg.key.id },
            message: { extendedTextMessage: { text: commandText, contextInfo: { ...contextInfo, participant: sender, mentionedJid: [sender] } } }
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
            return sock.sendMessage(chatId, { text: `❌ لم يتم العثور على الأمر: ${cmdName}` }, { quoted: msg });
        }

        try {
            await plugin.execute(sock, fakeMsg, cmdArgs);
        } catch (e) {
            console.error(`❌ خطأ أثناء تنفيذ '${cmdName}' في ${groupId}`, e);
            return sock.sendMessage(chatId, { text: `⚠️ حدث خطأ أثناء تنفيذ الأمر في الجروب.` }, { quoted: msg });
        }
    }
};