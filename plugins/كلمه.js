module.exports = {
    command: 'كلمه',
    category: 'ترفيه',
    description: 'يعرض كلمه عشوائيه لشخصيه انمي عشوائية 🐊',
    async execute(sock, m) {
        const chatId = m.key.remoteJid;

        const animeQuotes = [
            "💬 *Naruto Uzumaki:* أنا لا أرجع بكلامي... هذا هو طريقي في الزرف⚖️!",
            "💬 *Itachi Uchiha:* حتى أقوى الناس لديهم ضعف.",
            "💬 *Luffy:* أنا سأكون ملك القراصنة!",
            "💬 *Levi Ackerman:* الخيار الأفضل دائماً هو البقاء حياً.",
            "💬 *Goku:* القتال من أجل من تحب هو ما يعطيك القوة.",
            "💬 *Eren Yeager:* سأدمرهم... كل واحد منهم!",
            "💬 *Gojo Satoru:* أنا الأقوى ببساطة.",
            "💬 *Kakashi Hatake:* أولئك الذين يكسرون القوانين هم قمامة، ولكن الذين يتركون أصدقاءهم أسوأ من القمامة.",
            "💬 *Zoro:* أعدك، لن أخسر مجدداً!",
            "💬 *L:* إذا لم تستطع الفوز باللعبة، فغيّر القواعد.",
            "💬 *Asta:* حتى لو لم يكن لدي سحر... سأصبح الإمبراطور السحري!",
            "💬 *Killua:* لا يمكنك الفوز إذا كنت خائفًا من الخسارة.",
            "💬 *Edward Elric:* حياة الإنسان لا تُقاس بالأوزان.",
            "💬 *Tanjiro:* لا يهم كم أتعرض للضرب، سأقف مرة أخرى.",
            "💬 *Yato:* الآلهة لا تنقذ، البشر ينقذون أنفسهم.",
            "💬 *Sasuke Uchiha:* الكراهية تجعلني أمضي قدمًا.",
            "💬 *Madara Uchiha:* في هذا العالم، أينما يوجد الضوء، يوجد الظلام أيضاً.",
            "💬 *Hinata:* سأثبت أنني أستطيع أن أصبح قوية مثلك يا ناروتو.",
            "💬 *Shoto Todoroki:* أنا لست أبي.",
            "💬 *Vegeta:* حتى الأمير يحتاج إلى أن يخسر ليصبح أقوى."
        ];

        const randomQuote = animeQuotes[Math.floor(Math.random() * animeQuotes.length)];

        await sock.sendMessage(chatId, { text: randomQuote });
    }
};