// كود بسيط لطلب رمز الاقتران
module.exports = {
    name: 'pair',
    description: 'الحصول على كود الربط',
    async execute(m, { client, args }) {
        if (!args[0]) return m.reply('يجب كتابة الرقم، مثال: .pair 967xxxxxxxxx');
        const phoneNumber = args[0];
        m.reply('جاري جلب كود الربط...');
        // هنا يتم استدعاء ميزة الربط في البوت
        const code = await client.requestPairingCode(phoneNumber);
        m.reply(`كود الربط الخاص بك هو: ${code}`);
    }
};
