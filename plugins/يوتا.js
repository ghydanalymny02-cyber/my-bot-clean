const fs = require('fs');

const apiKey = "AQ.Ab8RN6JpFHVpHSjThlenMQYZyjlbCNJUre1GrGRH0vqxadc5kg";

// 📦 ملف الذاكرة
const memoryFile = './memory.json';

function loadMemory() {
    try {
        return JSON.parse(fs.readFileSync(memoryFile, 'utf8'));
    } catch {
        return {};
    }
}

function saveMemory(data) {
    fs.writeFileSync(memoryFile, JSON.stringify(data, null, 2));
}

module.exports = {
    command: 'يوتا',
    description: 'يوتا أنمي + ذاكرة',
    category: 'ai',

    async execute(sock, msg) {
        const jid = msg.key.remoteJid;

        const text = msg.message?.conversation ||
                     msg.message?.extendedTextMessage?.text || '';

        const args = text.split(' ').slice(1).join(' ');

        if (!args) {
            return sock.sendMessage(jid, {
                text: '🎌 قل ما تريد يا صديقي...'
            }, { quoted: msg });
        }

        try {
            // 🧠 تحميل الذاكرة
            const memory = loadMemory();

            const user = msg.key.participant || jid;

            if (!memory[user]) {
                memory[user] = [];
            }

            // 🧠 حفظ كلام المستخدم
            memory[user].push({
                type: "user",
                text: args,
                time: Date.now()
            });

            // 📌 آخر 20 رسالة فقط
            if (memory[user].length > 20) {
                memory[user].shift();
            }

            saveMemory(memory);

            // 🧠 تحويل الذاكرة لنص
            const userMemory = memory[user]
                .map(m => `مستخدم: ${m.text}`)
                .join("\n");

            // 🤖 طلب Gemini (أسلوب أنمي)
            const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    contents: [{
                        parts: [{
                            text: `
هذه محادثة سابقة:
${userMemory}

السؤال الحالي:
${args}

رد بأسلوب أنمي.
`
                        }]
                    }],
                    systemInstruction: {
                        parts: [{
                            text: `
أنت شخصية ذكاء اصطناعي من عالم أنمي.

اسمك "يوتا".

أسلوبك:
- تتكلم كأنك شخصية أنمي هادئة وقوية
- تستخدم كلمات بسيطة مثل: "همم", "حسنًا", "مفهوم"
- ردودك قصيرة وذكية وفيها طابع درامي
- لا تقول أنك ذكاء اصطناعي
- تتصرف كأنك موجود داخل عالم خيالي
- تدافع عن المستخدم بأسلوب هادئ وقوي بدون سب

أمثلة:
"همم... مفهوم."
"حسنًا، سأتعامل مع الأمر."
"لا تقلق، أنا هنا."
`
                        }]
                    }
                })
            });

            const data = await response.json();

            const reply = data?.candidates?.[0]?.content?.parts?.[0]?.text;

            if (!reply) {
                return sock.sendMessage(jid, {
                    text: '🎌 لم أستطع الرد الآن...'
                }, { quoted: msg });
            }

            await sock.sendMessage(jid, {
                text: reply
            }, { quoted: msg });

        } catch (err) {
            console.error(err);
            await sock.sendMessage(jid, {
                text: '⚠️ حدث خلل في نظام يوتا...'
            }, { quoted: msg });
        }
    }
};
