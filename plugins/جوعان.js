const { jidDecode } = require('@whiskeysockets/baileys');

const decode = jid => (jidDecode(jid)?.user || jid.split('@')[0]) + '@s.whatsapp.net';

module.exports = {
    command: 'جوعان',
    description: 'يعرض قائمة أكلات سهلة وسريعة أو وصفة بالتفصيل',
    usage: '.جعان [رقم الأكلة]',
    category: 'ترفيهي',

    async execute(sock, msg) {
        try {
            const chatId = msg.key.remoteJid;
            const text = msg.message?.conversation || msg.message?.extendedTextMessage?.text || '';
            const args = text.split(' ').slice(1);

            const list = [
                {
                    name: 'بيض بالطماطم',
                    recipe: `- قطّع طماطم وبصل.\n- شوّحهم بزيت.\n- اكسر البيض عليهم وسيبه لحد ما يستوي.`,
                    joke: 'مشروع فطار عالمي بـ 3 جنيه 😂🥚'
                },
                {
                    name: 'سندويتش جبنة',
                    recipe: `- افتح عيش.\n- حط جبنة بيضا أو رومي.\n- شوية خيار أو طماطم وشكراً.`,
                    joke: 'ده مش أكل.. ده طوق نجاة نص الليل 😅🧀'
                },
                {
                    name: 'نودلز سريعة',
                    recipe: `- حط النودلز في ميه سخنة.\n- ضيف البهارات الجاهزة.\n- قلب وسيبها 5 دقايق وخلاص.`,
                    joke: 'مخترع النودلز كان بيموت من الجوع باين 😂🍜'
                },
                {
                    name: 'بطاطس محمرة',
                    recipe: `- قشّر وقطّع البطاطس.\n- حطها في زيت سخن.\n- لما تتحمّر طلّعها ورش شوية ملح.`,
                    joke: 'لو مزاجك وحش... دي هتصلّحه فورًا 🥔🔥'
                },
                {
                    name: 'تونة بالمايونيز',
                    recipe: `- افتح علبة تونة.\n- صفيها من الزيت.\n- اخلطها مع شوية مايونيز ولمون.`,
                    joke: 'سندويتش التونة دايمًا بيكون مفاجأة... يا حلو يا كابوس 😅🐟'
                },
                {
                    name: 'عيش بالزيت والسكر',
                    recipe: `- سخّن رغيف عيش.\n- ادهنه زيت أو سمنة.\n- رش عليه سكر وخلاص.`,
                    joke: 'الفقير لما يتفنن 😁🍞✨'
                },
                {
                    name: 'بيض مسلوق',
                    recipe: `- حط البيض في ميه على النار.\n- سيبه 10 دقايق.\n- قشّره وكلّه.`,
                    joke: 'أكلة المذاكرة الرسمية 🧠🥚'
                },
                {
                    name: 'سندويتش فول',
                    recipe: `- سخّن شوية فول.\n- ضيف زيت وكمون ولمون.\n- حطه في عيش.\n- ممكن تزود طماطم.`,
                    joke: 'لو جعان جامد... الفول هو القائد 🚀'
                },
                {
                    name: 'جبنة بالطماطم',
                    recipe: `- قطّع طماطم صغيرة.\n- حطها على جبنة بيضا.\n- رش زعتر أو نعناع ناشف.`,
                    joke: 'عشاء فني رايق بتكلفة فكة 😌🧀🍅'
                },
                {
                    name: 'مكرونة بالسمنة والملح',
                    recipe: `- اسلق مكرونة.\n- صفّيها.\n- ضيف عليها شوية سمنة وملح.\n- قلّب وخلاص.`,
                    joke: 'أكلة طوارئ بس بتسيب أثر نفسي عظيم 😂🍝'
                }
            ];

            if (!args[0]) {
                let menuText = `*┏━━━〈 🍽️ قائمة الأكلات 〉━━━┓*\n`;
                for (let i = 0; i < list.length; i++) {
                    menuText += `*┃ ${i + 1}. 🍴 ${list[i].name}*\n`;
                }
                menuText += `*┗━━━━━━━━━━━━━━━━━━┛*\n\n`;
                menuText += `😋 أكيد ده جوع آخر الليل!\n\n📝 اكتب: *.جعان 5* مثلًا علشان أقولك الوصفة بالتفصيل!
مـــجـــهـــول⊰𝑩𝑶𝑻 🌋`;

                return await sock.sendMessage(chatId, { text: menuText }, { quoted: msg });
            }

            const num = parseInt(args[0]);
            if (isNaN(num) || num < 1 || num > list.length) {
                return await sock.sendMessage(chatId, {
                    text: `❌ رقم الأكلة غير صحيح. اختار رقم من 1 إلى ${list.length}.`
                }, { quoted: msg });
            }

            const item = list[num - 1];
            const recipeText = `*🍴 ${item.name}:*\n\n${item.recipe}\n\n🤣 ${item.joke}`;

            await sock.sendMessage(chatId, { text: recipeText }, { quoted: msg });

        } catch (error) {
            console.error('❌ خطأ في أمر جعان:', error);
            await sock.sendMessage(msg.key.remoteJid, {
                text: '❌ حدث خطأ أثناء عرض الوصفات، حاول مرة أخرى.'
            }, { quoted: msg });
        }
    }
};