module.exports = {
    command: 'اذكار-الصباح',
    description: 'أذكار الصباح',
    usage: '.صباحية',
    category: 'ديني',    
    
    async execute(sock, msg) {
        try {
            const decoratedText = `> 🌅 *أذكار الصباح* 🌅\n
- 1. *اللهم بك أصبحنا وبك أمسينا وبك نحيا وبك نموت وإليك النشور.*

- 2. *أصبحنا وأصبح الملك لله، والحمد لله، لا إله إلا الله وحده لا شريك له، له الملك وله الحمد وهو على كل شيء قدير.*

- 3. *اللهم إني أسألك خير هذا اليوم: فتحه، ونصره، ونوره، وبركته، وهداه، وأعوذ بك من شر ما فيه وشر ما بعده.*

- 4. *اللهم عافني في بدني، اللهم عافني في سمعي، اللهم عافني في بصري، لا إله إلا أنت.*

- 5. *أعوذ بكلمات الله التامات من شر ما خلق.* (3 مرات)

- 6. *حسبي الله لا إله إلا هو عليه توكلت وهو رب العرش العظيم.* (7 مرات)

- 7. *آية الكرسي:* (البقرة:255) اللّهُ لا إِلَهَ إِلَّا هُوَ الْحَيُّ الْقَيُّومُ ... وَهُوَ الْعَلِيُّ الْعَظِيمُ.

- 8. *سورة الإخلاص، الفلق، الناس* (3 مرات لكل سورة`;
            await sock.sendMessage(msg.key.remoteJid, {
                text: decoratedText,
                mentions: [msg.sender]
            }, { quoted: msg });
        } catch (error) {
            console.error('❌', 'Error executing test:', error);
            await sock.sendMessage(msg.key.remoteJid, {
                text: responses.error.general(error.message || error.toString())
            }, { quoted: msg });
        }
    }
};