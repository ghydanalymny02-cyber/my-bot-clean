const choices = [
  "لو خيروك تعيش بدون نت أو بدون أصدقاء، وش تختار؟ 🌐👥",
  "لو خيروك تنسى كل شي أو تبدأ من الصفر، أيهم تختار؟ 🔁🧠",
  "لو خيروك تعيش في الماضي أو المستقبل، وين تروح؟ ⏳🚀",
  "لو خيروك تكون مشهور بس مكروه، أو عادي بس محبوب؟ 💫❤️",
  "لو خيروك تفقد سمعك أو بصرك؟ 👂👁️",
  "لو خيروك تاخذ مليون دولار وتعيش وحيد، أو تعيش سعيد وفقير؟ 💸😊",
  "لو خيروك تسافر كل العالم بس ما تقدر ترجع بلدك، تقبل؟ 🌍✈️",
  "لو خيروك تختار شخص واحد فقط تكمل حياتك معاه، مين؟ 🫢❤️",
  "لو خيروك تعيش للأبد أو تموت بكرا، وش تختار؟ ♾️☠️",
  "لو خيروك تقدر تقرأ العقول أو تختفي، أي قوة تختار؟ 🧠👻",
];

module.exports = {
  command: 'لو-خيروك',
  description: 'يرسل لك سؤال لو خيروك عشوائي',
  usage: '.لو',
  category: 'ترفيه',
  async execute(sock, msg) {
    try {
      const random = choices[Math.floor(Math.random() * choices.length)];
      await sock.sendMessage(msg.key.remoteJid, {
        text: `🤔 لو خيروك:\n\n${random}`,
        quoted: msg,
      });
    } catch (error) {
      console.error('❌ خطأ في أمر لو:', error);
      await sock.sendMessage(msg.key.remoteJid, {
        text: `❌ حدث خطأ أثناء تنفيذ الأمر: ${error.message || error.toString()}`,
      }, { quoted: msg });
    }
  },
};