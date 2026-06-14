const words = [
  "أتوميك","ناروتو","ون بيس","ديث نوت","كيميتسو","بليتش","سايتاما","غوكو","ساكورا",
  "هجوم العمالقة","يوغي","شيروكو","أنمي","ساموراي","نينجا","شينوبي","بوكيمون","دراجون بول",
  "لوفي","زاكورو","سينت سيا","شينجا","إينوياشا","هيناتا","ساسوكي","هيسوكا","توتورو",
  "كاكاشي","سايبر","غينتاما","كايدا","ميكاسا","ليفي","راكوشي","ميغومي","مورتال كومبات",
  "ديغيمون","شيزوكا","فينوم","ليتشي","إيتاتشي","غاركو","ساسوري","كايتو","هاروكو","ناتسو",
  "إيرينا","تايتان","شينجي","ريو","هاروهي","يوكي","سانجي","تشانغ","ريكين","كيرا","ليو",
  "زينو","كين","ليلي","كايو","هيوغا","تينتسو","ميكو","أوروتشيمارو","ريوك","شيزو","تينكو",
  "مادارا","كوبي","ريزا","هيرو","أليتا","ساي","كاجومي","ماكوتو","ريكو"
];

const fs = require('fs');
const path = require('path');
const pointsFile = path.join(__dirname, '../data/ranks.json');
let points = {};
const scrambleGames = {};

// تحميل النقاط
if (fs.existsSync(pointsFile)) points = JSON.parse(fs.readFileSync(pointsFile));
function savePoints() { fs.writeFileSync(pointsFile, JSON.stringify(points, null, 2)); }
function getLevel(p) { if(p>=1000) return '⭐ متقدم'; if(p>=500) return '💎 محترف'; if(p>=200) return '🌱 مبتدئ'; if(p<0) return '🪫 نوب'; return '🌱 مبتدئ'; }

const scrambleWord = word => word.split('').sort(() => Math.random() - 0.5).join(' ');

module.exports = {
  command: 'ترتيب',
  category: 'game',
  description: 'لعبة ترتيب الحروف مع نظام نقاط ومستوى',

  async execute(sock, msg) {
    const chatId = msg.key.remoteJid;
    if (!chatId.endsWith('@g.us')) return sock.sendMessage(chatId, { text: '❌ هذا الأمر يعمل فقط في المملكة.' }, { quoted: msg });

    if (scrambleGames[chatId]) return sock.sendMessage(chatId, { text: '⚠️ هناك لعبة قائمة حالياً، أكملوها قبل بدء واحدة جديدة.\n\n˼🕸️˹⥃ مـــجـــهـــول ⊰𝑩𝑶𝑻❄' }, { quoted: msg });

    const randomWord = words[Math.floor(Math.random() * words.length)].replace(/\s+/g,'');
    const scrambled = scrambleWord(randomWord);

    scrambleGames[chatId] = { answer: randomWord.toLowerCase(), finished: false };

    await sock.sendMessage(chatId, {
      text: `•⪼ ⸽ ˼🕸️˹⥃ *فعالية ترتيب الحروف*\n*˼🕸️˹⥃ الكلمة المشوشة:* *${scrambled}*\n⏳ لديك 30 ثانية فقط!\n\nمـــجـــهـــول ⊰𝑩𝑶𝑻❄`,
      mentions: [msg.key.participant]
    }, { quoted: msg });

    const handler = async ({ messages }) => {
      const reply = messages[0];
      if (!reply.message) return;

      const from = reply.key.remoteJid;
      if (from !== chatId || reply.key.fromMe) return;

      const text = (reply.message.conversation || reply.message.extendedTextMessage?.text || '').replace(/\s+/g,'').toLowerCase();
      if (text === scrambleGames[chatId].answer) {
        scrambleGames[chatId].finished = true;
        const sender = reply.key.participant || reply.key.remoteJid;
        points[sender] = (points[sender]||0)+1;
        savePoints();

        sock.ev.off('messages.upsert', handler);
        delete scrambleGames[chatId];

        await sock.sendMessage(chatId, {
          text: `•⪼ ⸽ ˼🕸️˹⥃ *تم حل الكلمة!*\n*˼🕸️˹⥃ الكلمة:* *${randomWord}*\n*˼🕸️˹⥃ الفائز:* @${sender.split('@')[0]}\n*˼🕸️˹⥃ نقاطه:* ${points[sender]}\n*˼🕸️˹⥃ مستواه:* ${getLevel(points[sender])}\nمـــجـــهـــول ⊰𝑩𝑶𝑻❄`,
          mentions: [sender]
        }, { quoted: reply });
      }
    };

    sock.ev.on('messages.upsert', handler);

    setTimeout(() => {
      if (scrambleGames[chatId] && !scrambleGames[chatId].finished) {
        sock.sendMessage(chatId, {
          text: `⌛ انتهى الوقت!\n❌ الإجابة الصحيحة: *${randomWord}*\n𝒀𝑼𝑴𝑰𝑳𝑨⊰𝑩𝑶𝑻❄`
        }, { quoted: msg });
        delete scrambleGames[chatId];
        sock.ev.off('messages.upsert', handler);
      }
    }, 30000);
  }
};