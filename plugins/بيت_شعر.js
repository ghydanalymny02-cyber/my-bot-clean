// *حقوق مطورة يوميلا 🛡*
// 📄 *بيت_شعر.js*

module.exports = {
  command: ['بيت شعر'],
  description: '✍️ يرسل بيت شعر فخم',
  category: 'fun',

  async execute(sock, msg) {
    try {
      const verses = [
        "✍️ إذا غامرتَ في شرفٍ مرومِ… فلا تقنعْ بمـا دون النجومِ",
        "✍️ وما نيلُ المطالبِ بالتمني… ولكن تُؤخذُ الدنيا غلابا",
        "✍️ إذا أنتَ أكرمتَ الكريمَ ملكته… وإنْ أنتَ أكرمتَ اللئيمَ تمردا"
      ];
      const randomVerse = verses[Math.floor(Math.random() * verses.length)];

      await sock.sendMessage(msg.key.remoteJid, { text: randomVerse }, { quoted: msg });
    } catch (err) {
      console.error('❌ خطأ في أمر بيت شعر:', err);
    }
  }
};