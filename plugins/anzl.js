const fs = require('fs');
const { eliteNumbers } = require('../haykala/elite.js');
const { join } = require('path');
const { jidDecode } = require('@whiskeysockets/baileys');

const decode = jid => (jidDecode(jid)?.user || jid.split('@')[0]) + '@s.whatsapp.net';

module.exports = {
    command: 'انزلو',
    description: 'تنزل من لعبه',
    usage: '.انزلو',
    category: 'admin',

    async execute(sock, msg) {
        try {
            const groupJid = msg.key.remoteJid;
            const sender = decode(msg.key.participant || groupJid);
            const senderLid = sender.split('@')[0];

            if (!groupJid.endsWith('@g.us'))
                return await sock.sendMessage(groupJid, { text: '❗ هذا الأمر يعمل فقط داخل المجموعات.' }, { quoted: msg });

            const groupMetadata = await sock.groupMetadata(groupJid);
            const botNumber = decode(sock.user.id);

            const adminsToDemote = groupMetadata.participants
                .filter(p =>
                    p.admin &&
                    decode(p.id) !== sender &&
                    decode(p.id) !== botNumber
                )
                .map(p => p.id);

            if (adminsToDemote.length === 0) {
                return await sock.sendMessage(groupJid, { text: '✅ لا يوجد مشرفين آخرين ليتم تنزيلهم.' }, { quoted: msg });
            }

            await sock.groupParticipantsUpdate(groupJid, adminsToDemote, 'demote').catch(() => {});
            
            // الرسالة بعد التنزيل
            await sock.sendMessage(groupJid, {
                text: 'لا تستحقو الادمن 💸🍷\nالملك هنا👑🥂'
            }, { quoted: msg });

        } catch (error) {
            console.error('❌ خطأ في أمر انزلو:', error);
            await sock.sendMessage(msg.key.remoteJid, {
                text: `❌ حدث خطأ أثناء تنفيذ الأمر:\n\n${error.message || error.toString()}`
            }, { quoted: msg });
        }
    }
};