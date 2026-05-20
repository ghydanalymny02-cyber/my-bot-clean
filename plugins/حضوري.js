const fs = require('fs');
const path = require('path');

const folderPath = path.join(__dirname, '../resources');
const indexFile = path.join(folderPath, 'index.json');
const videoList = ['escanor.mp4', 'escanor1.mp4', 'escanor2.mp4', 'escanor3.mp4', 'escanor4.mp4'];
const soundPath = path.join(folderPath, 'batman', 'batsound.mp3');

module.exports = {
  command: "حضوري",
  description: "تسجيل حضور اسكانور بفيديو فخم 🎥👑",
  usage: ".حضوري",
  react: "👑",

  execute: async (sock, msg, args) => {
    const from = msg.key.remoteJid;

    if (!fs.existsSync(folderPath)) fs.mkdirSync(folderPath, { recursive: true });
    if (!fs.existsSync(indexFile)) fs.writeFileSync(indexFile, JSON.stringify({ index: 0 }));

    let { index } = JSON.parse(fs.readFileSync(indexFile));
    const videoName = videoList[index];
    const videoPath = path.join(folderPath, videoName);

    if (!fs.existsSync(videoPath)) {
      return sock.sendMessage(from, { text: '⚠️ لم يتم العثور على الفيديو الحالي.' }, { quoted: msg });
    }

    index = (index + 1) % videoList.length;
    fs.writeFileSync(indexFile, JSON.stringify({ index }));

    const caption = `*┏━━━━━━━ 👑 𝐇𝐄 𝐈𝐒 𝐇𝐄𝐑𝐄 👑 ━━━━━━━┓*

👑 تم تسجيل *𝒀𝑼𝑴𝑰𝑳𝑨* " بنجاح!
أنا الشخص الذي يتربع على قمة العشائر.❄
🔥كن حلما للجميع ولا تحلم بأحد.

*┗━━━━━━━━━━━━━━━━━━━━━━━━━━┛*`;

    await sock.sendMessage(from, {
      video: fs.readFileSync(videoPath),
      caption,
      mimetype: 'video/mp4'
    }, { quoted: msg });

    // إرسال الصوت (إن وجد)
    if (fs.existsSync(soundPath)) {
      await sock.sendMessage(from, {
        audio: fs.readFileSync(soundPath),
        mimetype: 'audio/mp4',
        ptt: true // لو عايزه يظهر كأنه ڤويس نوت
      }, { quoted: msg });
    }
  }
};