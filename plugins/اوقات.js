module.exports = {
  command: 'اوقات',
  category: 'tools',
  description: 'عرض الوقت للدول العربية فقط بدون مكتبات',

  async execute(client, msg) {

    function getTime(zone) {
      return new Intl.DateTimeFormat('ar', {
        timeZone: zone,
        hour: '2-digit',
        minute: '2-digit',
        hour12: true,
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        numberingSystem: 'latn' // أرقام تركية/غربية
      }).format(new Date());
    }

    const arabCountries = [
      ['🇸🇦 السعودية', 'Asia/Riyadh'],
      ['🇪🇬 مصر', 'Africa/Cairo'],
      ['🇦🇪 الإمارات', 'Asia/Dubai'],
      ['🇶🇦 قطر', 'Asia/Qatar'],
      ['🇰🇼 الكويت', 'Asia/Kuwait'],
      ['🇮🇶 العراق', 'Asia/Baghdad'],
      ['🇱🇧 لبنان', 'Asia/Beirut'],
      ['🇯🇴 الأردن', 'Asia/Amman'],
      ['🇸🇾 سوريا', 'Asia/Damascus'],
      ['🇵🇸 فلسطين', 'Asia/Gaza'],
      ['🇵🇸 فلسطين (القدس)', 'Asia/Jerusalem'],
      ['🇧🇭 البحرين', 'Asia/Bahrain'],
      ['🇴🇲 عمان', 'Asia/Muscat'],
      ['🇾🇪 اليمن', 'Asia/Aden'],
      ['🇸🇩 السودان', 'Africa/Khartoum'],
      ['🇩🇿 الجزائر', 'Africa/Algiers'],
      ['🇲🇦 المغرب', 'Africa/Casablanca'],
      ['🇹🇳 تونس', 'Africa/Tunis'],
      ['🇱🇾 ليبيا', 'Africa/Tripoli'],
      ['🇲🇷 موريتانيا', 'Africa/Nouakchott'],
      ['🇰🇲 جزر القمر', 'Indian/Comoro'],
      ['🇩🇯 جيبوتي', 'Africa/Djibouti']
    ];

    let text = `🕒 الوقت الآن في الدول العربية:\n\n`;

    for (let [name, zone] of arabCountries) {
      text += `${name}: ${getTime(zone)}\n`;
    }

    await client.sendMessage(msg.key.remoteJid, { text });
  }
};