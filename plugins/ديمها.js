const fs = require('fs');
const path = require('path');
const { jidDecode } = require('@whiskeysockets/baileys');
const { eliteNumbers: ALLOWED_ADMINS } = require(path.join(process.cwd(), 'haykala', 'elite.js'));

const dataDir = path.join(__dirname, '..', 'data');
const monitorFile = path.join(dataDir, 'demhaState.json');

if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true });
if (!fs.existsSync(monitorFile)) fs.writeFileSync(monitorFile, JSON.stringify({}));

const loadState = () => {
    try {
        return JSON.parse(fs.readFileSync(monitorFile));
    } catch (err) {
        console.error("خطأ في قراءة ملف المراقبة:", err);
        return {};
    }
};

const saveState = (data) => {
    try {
        fs.writeFileSync(monitorFile, JSON.stringify(data, null, 2));
    } catch (err) {
        console.error("خطأ في حفظ ملف المراقبة:", err);
    }
};

let handlerAttached = false;

module.exports = {
    command: 'ديمها',
    description: '🚨 طرد أي عضو يسحب إشراف من غيره.',
    category: 'DEVELOPER',
    async execute(sock, m) {
        const groupId = m.key.remoteJid;
        const sender = m.key.participant || m.participant;

        if (!groupId.endsWith('@g.us')) {
            return sock.sendMessage(groupId, { text: '❌ هذا الأمر يعمل فقط داخل المجموعات.' }, { quoted: m });
        }

        const senderNumber = (sender || '').split('@')[0];
        if (!ALLOWED_ADMINS.includes(senderNumber)) {
            return sock.sendMessage(groupId, { text: '⚠️ هذا الأمر مخصص فقط للنخبة.' }, { quoted: m });
        }

        const state = loadState();

        if (state[groupId]) {
            delete state[groupId];
            saveState(state);
            return sock.sendMessage(groupId, { text: '❎ تم إلغاء وضع "ديمها" في هذه المجموعة.' }, { quoted: m });
        }

        state[groupId] = true;
        saveState(state);
        sock.sendMessage(groupId, { text: '✅ تم تفعيل وضع "ديمها" لمراقبة الإشراف.' }, { quoted: m });

        if (handlerAttached) return;

        sock.ev.on('group-participants.update', async (update) => {
            const state = loadState();
            const groupId = update.id;
            if (!state[groupId]) return;

            try {
                // لو كان فيه شخص انطرد من الاشراف
                if (update.action === 'demote') {
                    const actor = update.author; // الشخص اللي سحب الإشراف
                    if (actor) {
                        await sock.groupParticipantsUpdate(groupId, [actor], 'remove').catch(console.error);

                        // بعد الطرد يرسل الرسالة
                        await sock.sendMessage(groupId, { text: 'ديمها يارب ديمها 👽🎩' });
                    }
                }
            } catch (err) {
                console.error("خطأ أثناء تنفيذ ديمها:", err);
            }
        });

        handlerAttached = true;
    }
};