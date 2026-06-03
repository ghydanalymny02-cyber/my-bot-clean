const { exec } = require('child_process');
const fs = require('fs-extra');
const path = require('path');

module.exports = {
    command: 'تنصيب',
    description: 'تنصيب بوت جديد',
    usage: '.تنصيب [اسم]',
    category: 'tools',

    async execute(sock, msg, args) {
        const jid = msg.key.remoteJid;
        
        // هنا نقوم باستخراج الاسم بطريقة يدوية لضمان قراءته
        const body = msg.message?.conversation || msg.message?.extendedTextMessage?.text || "";
        const parts = body.split(' '); // تقسيم الرسالة بمسافات
        const newBotName = parts[1]; // الكلمة الثانية هي الاسم

        if (!newBotName) {
            return await sock.sendMessage(jid, { text: '❗ يرجى كتابة اسم للبوت الجديد بعد كلمة تنصيب.\nمثال: .تنصيب اسمك' }, { quoted: msg });
        }

        const destination = path.join(__dirname, '../bots_storage', newBotName);

        if (fs.existsSync(destination)) {
            return await sock.sendMessage(jid, { text: '❗ هذا الاسم مستخدم مسبقاً.' }, { quoted: msg });
        }

        await sock.sendMessage(jid, { text: '⏳ جاري التنصيب، يرجى الانتظار...' }, { quoted: msg });

        try {
            await fs.copy(path.join(__dirname, '../bots_storage/template_bot'), destination);

            // أمر التنصيب
            exec(`cd "${destination}" && npm install && pm2 start main.js --name "${newBotName}"`, (error) => {
                if (error) {
                    return sock.sendMessage(jid, { text: '❌ خطأ في التثبيت: ' + error.message }, { quoted: msg });
                }
                sock.sendMessage(jid, { text: `✅ تم تنصيب وتشغيل البوت بنجاح باسم: ${newBotName}` }, { quoted: msg });
            });
        } catch (err) {
            await sock.sendMessage(jid, { text: '❌ خطأ في النظام: ' + err.message }, { quoted: msg });
        }
    }
};

