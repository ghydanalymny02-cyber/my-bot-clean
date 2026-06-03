const fs = require('fs');

module.exports = {
    command: 'اهانه',
    async execute(sock, m) {
        const chatId = m.key.remoteJid;
        const sender = m.key.participant || m.participant || m.key.remoteJid;

        if (!chatId.endsWith('@g.us')) {
            return sock.sendMessage(chatId, { text: `🚫 هذا الأمر يعمل فقط في *المجموعات*!` });
        }

        const mentionedJids = m.message.extendedTextMessage?.contextInfo?.mentionedJid || [];

        if (mentionedJids.length === 0) {
            return sock.sendMessage(chatId, { text: `❌ استخدم الأمر مع منشن لشخص لإهانته! مثال: *•اهانه @الشخص*` });
        }

        const target = mentionedJids[0];

        const insults = [
            "🤡 أنت غبي لدرجة إنك بتناقش الحيطة - You're so stupid you argue with walls.",
            "🤡 دماغك فاضية أكتر من جدول حصص يوم الجمعة - Your brain is emptier than a Friday school schedule.",
            "🤡 شكلك سبب في انقراض الديناصورات - You probably caused the dinosaurs’ extinction.",
            "🤡 أنت فاشل حتى في الفشل - You're a failure even at failing.",
            "🤡 أنت الشخص اللي محدش بيشتاقله - You're the kind of person no one misses.",
            "🤡 ذكاءك زي شبكة واي فاي في الصحراء - Your intelligence is like Wi-Fi in the desert.",
            "🤡 صوتك يخلي الأطفال تبطل بكا - Your voice makes babies stop crying out of confusion.",
            "🤡 وجودك زي إعلان اليوتيوب اللي مينفعش يتشال - Your presence is like a YouTube ad you can't skip.",
            "🤡 لو كنت نكته، محدش كان هيضحك - If you were a joke, no one would laugh.",
            "🤡 دمك تقيل أكتر من زلط في جيب - You're heavier than rocks in a pocket.",
            "🤡 دماغك فيها عطل مصنعي - Your brain has a factory defect.",
            "🤡 أنت دليل حي على فشل التطور - You're living proof evolution makes mistakes.",
            "🤡 شكلك بيخلي المراية تبكي - Your face makes mirrors cry.",
            "🤡 حتى جوجل مش لاقي معلومات عنك - Even Google can't find anything useful about you.",
            "🤡 لما بتتكلم، الذكاء بينتحر - When you speak, intelligence dies.",
            "🤡 دمك أنشف من كعب الصحراوي - Your humor is drier than desert heels.",
            "🤡 لو كنت برنامج، كان لازم يتفرمت من أول يوم - If you were software, you'd need formatting day one.",
            "🤡 طريق تفكيرك محتاج صيانة عاجلة - Your thinking needs urgent maintenance.",
            "🤡 حضورك زي فصل صيف في يناير - Your presence is like summer in January — unnecessary.",
            "🤡 لولا إنك بتتنفس، كنت نسيت إنك موجود - If you didn’t breathe, I’d forget you exist.",
            "🤡 أنت غبي لدرجة إنك بتناقش الحيطة - You're so stupid you argue with walls.",
            "🤡 دماغك فاضية أكتر من جدول حصص يوم الجمعة - Your brain is emptier than a Friday school schedule.",
            "🤡 شكلك سبب في انقراض الديناصورات - You probably caused the dinosaurs’ extinction.",
            "🤡 أنت فاشل حتى في الفشل - You're a failure even at failing.",
            "🤡 أنت الشخص اللي محدش بيشتاقله - You're the kind of person no one misses.",
            "🤡 ذكاءك زي شبكة واي فاي في الصحراء - Your intelligence is like Wi-Fi in the desert.",
            "🤡 صوتك يخلي الأطفال تبطل بكا - Your voice makes babies stop crying out of confusion.",
            "🤡 وجودك زي إعلان اليوتيوب اللي مينفعش يتشال - Your presence is like a YouTube ad you can't skip.",
            "🤡 لو كنت نكتة، محدش كان هيضحك - If you were a joke, no one would laugh.",
            "🤡 دمك تقيل أكتر من زلط في جيب - You're heavier than rocks in a pocket.",
            "🤡 دماغك فيها عطل مصنعي - Your brain has a factory defect.",
            "🤡 أنت دليل حي على فشل التطور - You're living proof evolution makes mistakes.",
            "🤡 شكلك بيخلي المراية تبكي - Your face makes mirrors cry.",
            "🤡 حتى جوجل مش لاقي معلومات عنك - Even Google can't find anything useful about you.",
            "🤡 لما بتتكلم، الذكاء بينتحر - When you speak, intelligence dies.",
            "🤡 دمك أنشف من كعب الصحراوي - Your humor is drier than desert heels.",
            "🤡 لو كنت برنامج، كان لازم يتفرمت من أول يوم - If you were software, you'd need formatting day one.",
            "🤡 طريق تفكيرك محتاج صيانة عاجلة - Your thinking needs urgent maintenance.",
            "🤡 حضورك زي فصل صيف في يناير - Your presence is like summer in January — unnecessary.",
            "🤡 لولا إنك بتتنفس، كنت نسيت إنك موجود - If you didn’t breathe, I’d forget you exist.",
            "🤡 انت شخص مميز… مميز في الغباء - You're special... especially dumb.",
            "🤡 أنت بتفكر بنفس سرعة السلحفاة النائمة - You think at the speed of a sleeping turtle.",
            "🤡 لو كان في جائزة لأغبى شخص، كنت فزت بيها بالغلط - If there were a dumbest award, you'd win it by accident.",
            "🤡 صوتك بيكهربني بس مش حماس، رعب - Your voice electrifies me — with fear, not excitement.",
            "🤡 ملامحك زي لوحة رسمها طفل بعينه مغمضة - Your features look like a blindfolded kid drew you.",
            "🤡 أسلوبك في الكلام يجيب النوم - Your speaking style induces sleep.",
            "🤡 أنت موجود بس ملوش لازمة - You exist but serve no purpose.",
            "🤡 كلامك زي صفحة بيضاء، مفيهوش أي فايدة - Your words are like a blank page — meaningless.",
            "🤡 شكلك يصلح فيلم رعب بدون مكياج - You’re perfect for a horror movie — no makeup needed.",
            "🤡 لما تضحك، العالم بيحزن - When you laugh, the world mourns.",
            "🤡 عينيك بتقول إن مفيش أي فكرة شغالة جوه دماغك - Your eyes say nothing's operating inside your brain.",
            "🤡 لو كان فيه مسابقة للغباء، كنت حكم - If there were a stupidity contest, you'd be the judge.",
            "🤡 انت النكبة اللي محدش مستنيها - You're the disaster no one was waiting for.",
            "🤡 كلامك فاضي زي كيس شبسي بعد ما تفتحه - Your talk is as empty as a bag of chips after opening.",
            "🤡 عقلك محتاج إعادة تشغيل - Your brain needs a reboot.",
            "🤡 وجهك بيقول ‘مافيش أمل’ - Your face screams.",
            "🤡 مفيش فرق بينك وبين الكرسي، الاتنين بلا فكر - No difference between you and a chair — both thoughtless.",
            "🤡 لبسك مش أسوأ حاجة، وجودك هو الأسوأ - Your clothes aren’t the worst thing — your existence is.",
            "🤡 عقلك بينام أكتر منك - Your brain sleeps more than you do.",
            "🤡 انت نسخة غير ناجحة من شخص تاني - You're a failed version of someone else.",
            "🤡 ردودك أبطأ من إنترنت نوكيا - Your replies are slower than Nokia internet.",
            "🤡 لو الحماقة كانت موهبة، كنت بقيت مشهور - If stupidity were talent, you'd be famous.",
            "🤡 لو كانت الحماقة فن، أنت ليوناردو دافنشي - If foolishness were art, you’d be da Vinci.",
            "🤡 دمك ثقيل بدرجة تخليني أغير البلد - Your humor is so heavy it makes me wanna emigrate.",
            "🤡 انت العكس من الإلهام - You're the opposite of inspiration.",
            "🤡 لما بتتكلم، المنطق بيهرب - When you talk, logic flees.",
            "🤡 عندك طاقة سلبية بتكفي مدينة كاملة - You carry enough negativity to power a city.",
            "🤡 مشكلتك إنك فاكر نفسك مهم - Your problem is thinking you matter.",
            "🤡 تفكيرك سطحي أكتر من بركة مطر - Your thinking is shallower than a puddle.",
            "🤡 ضحكتك تخوف، مش تضحك - Your laugh is scary, not funny.",
            "🤡 وجودك بيقلل من ذكاء المكان - Your presence lowers the room's IQ.",
            "🤡 بتتكلم كتير وتقول ولا حاجة - You talk a lot and say nothing.",
            "🤡 حتى مرآتك زهقت منك - Even your mirror’s tired of you.",
            "🤡 كل الناس بتتعلم من أخطائها إلا أنت - Everyone learns from their mistakes… except you.",
            "🤡 نبرة صوتك تساوي نهاية السعادة - Your tone equals the death of joy.",
            "🤡 عندك وجه يسد النفس - You have a face that kills appetites.",
            "🤡 لما تظهر، الأمل يختفي - When you appear, hope vanishes.",
            "🤡 وجودك عبء على الكوكب - Your existence is a burden on Earth.",
            "🤡 أنت مثال حي للفشل المتنقل - You're a walking example of failure.",
            "🤡 مشكلتك إنك ما تعرفش إنك مشكلة - Your problem is not knowing you're the problem.",
            "🤡 الحيطان أذكى منك - Walls are smarter than you.",
            "🤡 صوتك بيخليني أراجع قرارات حياتي - Your voice makes me rethink life choices.",
            "🤡 لو الجهل مرض، أنت في العناية المركزة - If ignorance were a disease, you’d be in ICU.",
            "🤡 حتى الفشل بيتبرأ منك - Even failure disowns you.",
            "🤡 أنت بتسبب التوتر بصمتك - You cause stress in silence.",
            "🤡 نظرتك فيها فراغ يخوف - Your gaze has a terrifying emptiness.",
            "🤡 لو كنت أكلة، كنت حاجة محدش بيطلبها - If you were food, you'd be the dish no one orders.",
            "🤡 انت مصدر قلق بدون سبب - You're a source of stress for no reason.",
            "🤡 رد فعلك دايمًا متأخر، زي الإنترنت المقطوع - You're always late to react — like broken internet.",
            "🤡 تفكيرك ضحل لدرجة إن الضفادع تتوه فيه - Your thoughts are so shallow frogs get lost.",
            "🤡 لما تسكت، العالم يرتاح - When you’re silent, the world breathes.",
            "🤡 نكتك بتعكر المزاج - Your jokes ruin the mood.",
            "🤡 لولا الغباء، ما كنت هتكون أي حاجة - Without stupidity, you'd be nothing.",
            "🤡 كأنك نسخة تجريبية من إنسان - You're a beta version of a human.",
            "🤡 اللي يشوفك يفتكر الكارثة لسه ماشية - You look like the disaster’s still happening.",
            "🤡 لو كنت فكرة، كانت مرفوضة من أول نقاش - If you were an idea, you'd be rejected on sight.",
            "🤡 مخك شغال بطارية ضعيفة - Your brain runs on low battery.",
            "🤡 وجودك بيحسسني إني أذكى من أينشتاين - You make me feel smarter than Einstein.",
            "🤡 شكلك بيخلي الزرع يذبل - Plants wilt when they see you.",
            "🤡 انت النسخة غير المرغوب فيها من الحياة - You're life’s unwanted edition.",
            "🤡 لو كان في زر ‘تجاهل’ في الحقيقة، كنت أول واحد أضغطه - If real life had an ‘ignore’ button, you'd be first.",
            "🤡 حتى ظلك مش طايقك - Even your shadow avoids you.",
            "🤡 أنت صدمة مش مستاهلة - You're a useless shock.",
            "🤡 تنفسك مضيعة للأكسجين - You're wasting oxygen just breathing.",
            "🤡 الناس بتستفاد من وجودهم، إنت بتتنسى - People add value; you're just forgettable.",
            "🤡 دماغك زي حلة فاضية بتخبط - Your brain's like an empty pot — just noise.",
            "🤡 عندك القدرة على تدمير أي محادثة - You can ruin any conversation instantly.",
            "🤡 انت ما بتتسماش غبي، انت مرجع للغباء - You’re not just dumb — you’re the reference.",
            "🤡 لما بتفكر، بتحصل كارثة - When you think, disaster strikes.",
            "🤡 شكلك سبب في ارتفاع ضغط الدم - Looking at you causes hypertension.",
            "🤡 حتى لو دخلت موسوعة جينيس، هتدخلها كأغبى إضافة - Even in Guinness, you'd be the dumbest entry.",
            "🤡 لو كان في ريموت للحياة، كنت هعملك كتم - If life had a remote, you'd be on mute.",
            // الباقي هيكمل بنفس النمط...
        ];

        // اختار إهانة عشوائية
        const randomInsult = insults[Math.floor(Math.random() * insults.length)];

        // الرسالة النهائية مع المنشن
        const insultMessage = `👎 @${target.split('@')[0]}, ${randomInsult}`;
        await sock.sendMessage(chatId, { text: insultMessage, mentions: [target] });
    }
};