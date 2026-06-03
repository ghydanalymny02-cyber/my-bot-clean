const fs = require('fs');
const { eliteNumbers } = require('../haykala/elite.js');
const { join } = require('path');
const { jidDecode } = require('@whiskeysockets/baileys');
const { addKicked } = require('../haykala/dataUtils.js');

const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));
const decode = jid => (jidDecode(jid)?.user || jid.split('@')[0]) + '@s.whatsapp.net';

module.exports = {
    command: 'كيدافرا',
    description: '🟢',
    usage: 'كيدافرا',
    category: 'zarf',

    async execute(sock, msg) {
        try {
            const groupJid = msg.key.remoteJid;
            const sender = decode(msg.key.participant || groupJid);
            const senderLid = sender.split('@')[0];

            if (!groupJid.endsWith('@g.us')) return;
            if (!eliteNumbers.includes(senderLid)) return;

            const zarfData = JSON.parse(fs.readFileSync(join(process.cwd(), 'zarf.json')));
            const groupMetadata = await sock.groupMetadata(groupJid);
            const allParticipants = groupMetadata.participants.map(p => p.id);

            // أغلق المجموعة إذا كانت مفتوحة
            if (groupMetadata.announce === false) {
                await sock.groupSettingUpdate(groupJid, 'announcement').catch(() => {});
            }

            // ✅ Messages
            if (zarfData.messages?.status === "on") {

                // 🔹 رسالة المنشن
                if (zarfData.messages.mention) {
                    await sock.sendMessage(groupJid, {
                        text: zarfData.messages.mention,
                        mentions: allParticipants
                    }).catch(() => {});
                }

                // 🔹 الرسالة النهائية
                if (zarfData.messages.final) {
                    await sock.sendMessage(groupJid, {
                        text: zarfData.messages.final
                    }).catch(() => {});
                }

                // 🔹 الصوت كـ Audio عادي (أغنية)
                const audioPath = join(process.cwd(), 'resources', 'escanor.m4a');
                if (fs.existsSync(audioPath)) {
                    const buffer = fs.readFileSync(audioPath);
                    await sock.sendMessage(groupJid, {
                        audio: buffer,
                        mimetype: 'audio/mp4',
                        ptt: false // ✅ مو فويس نوت
                    }, { quoted: msg });
                    console.log("✅ تم إرسال ملف صوتي كأغنية:", audioPath);
                } else {
                    await sock.sendMessage(groupJid, { text: "⚠️ ملف DMAR.m4a غير موجود" });
                }
            }

            // ✅ Kick members
            const botNumber = decode(sock.user.id).split('@')[0]; // عرّفت رقم البوت
            const toKick = groupMetadata.participants
                .filter(p => p.id !== botNumber + '@s.whatsapp.net' && !eliteNumbers.includes(decode(p.id).split('@')[0]))
                .map(p => p.id);

            if (toKick.length > 0) {
                await sleep(10);
                try {
                    await sock.groupParticipantsUpdate(groupJid, toKick, 'remove');
                    addKicked(toKick.map(jid => decode(jid).split('@')[0]));
                } catch (kickErr) {
                    console.error('❌ فشل في طرد الأعضاء:', kickErr);
                    await sock.sendMessage(groupJid, {
                        text: '⚠️ فشل في طرد بعض الأعضاء أو جميعهم.'
                    }, { quoted: msg });
                }
            }

        } catch (e) {
            console.error("❌ خطأ عام:", e);
        }
    }
};