const path = require('path');
const fs = require('fs');

module.exports = {
    command: 'فاحصهم',
    async execute(sock, m) {
        try {
            const chatId = m.key.remoteJid;

            const message = `
*~┓━ ╼•╃⌬〔❄〕⌬╄•╾ ━┏~*
 *أڪــــــواد لــجمـيــــ؏ الأوامـــــࢪ*
*┛━━━━━━━••━━━━━━━┗*
*. اوامر*
*. اوامر-فئة*
*. اوامر-بايظه*
*. اوامر-غوجو*
*. اوامر-تنسيق*
*. اوامر-صورة*
*. اوامر-اقسام*
*. اوامر-فحص*
*. اوامر-تغيير*
*. اوامر-فئات*
*. اوامر-متكرره*
*. اوامر-مختلفه*
*. اوامر-منيو*
*. اوامر-شرح*

⚙️ *تطوير بواسطة:* 
⤸𝒀𝑼𝑴𝑰𝑳𝑨⊰𝑩𝑶𝑻⤹ ❄
            `.trim();

            // الصورة من مجلد resources
            const imagePath = path.join(__dirname, '../resources/escanor.jpg');

            // نتأكد أن الصورة موجودة
            if (!fs.existsSync(imagePath)) {
                return await sock.sendMessage(chatId, {
                    text: '❌ صورة gojo71 غير موجودة داخل مجلد resources.'
                });
            }

            await sock.sendMessage(chatId, {
                image: fs.readFileSync(imagePath),
                caption: message
            });

        } catch (error) {
            console.error('حدث خطأ أثناء تنفيذ أمر بوت:', error);
        }
    }
};