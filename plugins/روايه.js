const fetch = require('node-fetch');

const types = [ 'رعب', 'دراما نفسية', 'خيال علمي', 'تاريخي', 'رومانسي', 'غموض', 'مأساوي', 'فانتازيا', 'حربي', 'كوميديا سوداء', 'خارق للطبيعة' ];

const names = [ 'آدم', 'ليلى', 'كريم', 'هاروكا', 'سارة', 'ريان', 'جميلة', 'نايا', 'إلياس', 'كنان', 'جوري' ];

module.exports = { command: ['روايه'], category: 'fun', description: 'رواية قصيرة عشوائية أو حسب النوع المطلوب (رعب، رومانسية، إلخ)',

async execute(sock, msg, args = []) { const chatId = msg.key.remoteJid;

await sock.sendMessage(chatId, {
  react: { text: '📖', key: msg.key }
});

const userType = args.join(' ').trim();
const type = types.find(t => userType.includes(t)) || types[Math.floor(Math.random() * types.length)];
const character = names[Math.floor(Math.random() * names.length)];

const prompt = `اكتب رواية قصيرة لا تتجاوز 20 سطرًا باللغة العربية. النوع: ${type}. تأكد أن الحبكة غير تقليدية، مع نهاية مفاجئة، وابدأ القصة من نهايتها. الشخصية الرئيسية اسمها: ${character}`;

try {
  const res = await fetch(`https://api.siputzx.my.id/api/ai/meta-llama-33-70B-instruct-turbo?content=${encodeURIComponent(prompt)}`);
  const data = await res.json();

  if (!data.status || !data.data) {
    throw new Error('لم يتم الحصول على رد من الذكاء الاصطناعي.');
  }

  const story = data.data;

  await sock.sendMessage(chatId, {
    text: `📘 *رواية ${type}:*\n\n${story}`,
    quoted: msg
  });
} catch (err) {
  await sock.sendMessage(chatId, {
    text: `❌ خطأ في توليد الرواية: ${err.message}`,
    quoted: msg
  });
}

} };