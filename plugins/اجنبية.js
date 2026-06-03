module.exports = {
  command: 'اجنبية',
  category: 'tools',
  description: 'عرض الوقت للدول الأجنبية فقط بدون مكتبات',

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
        numberingSystem: 'latn' // أرقام غربية/تركية
      }).format(new Date());
    }

    const foreignCountries = [
      ['🇺🇸 الولايات المتحدة', 'America/New_York'],
      ['🇬🇧 بريطانيا', 'Europe/London'],
      ['🇫🇷 فرنسا', 'Europe/Paris'],
      ['🇩🇪 ألمانيا', 'Europe/Berlin'],
      ['🇨🇦 كندا', 'America/Toronto'],
      ['🇯🇵 اليابان', 'Asia/Tokyo'],
      ['🇨🇳 الصين', 'Asia/Shanghai'],
      ['🇦🇺 أستراليا', 'Australia/Sydney'],
      ['🇷🇺 روسيا', 'Europe/Moscow'],
      ['🇧🇷 البرازيل', 'America/Sao_Paulo'],
      ['🇮🇳 الهند', 'Asia/Kolkata'],
      ['🇲🇽 المكسيك', 'America/Mexico_City'],
      ['🇿🇦 جنوب أفريقيا', 'Africa/Johannesburg'],
      ['🇰🇷 كوريا الجنوبية', 'Asia/Seoul']
    ];

    let text = `🕒 الوقت الآن في بعض الدول الأجنبية:\n\n`;

    for (let [name, zone] of foreignCountries) {
      text += `${name}: ${getTime(zone)}\n`;
    }

    await client.sendMessage(msg.key.remoteJid, { text });
  }
};