const fs = require('fs');
const path = require('path');
const { eliteNumbers } = require('../haykala/elite.js'); // ملف النخبة

const dbDir = path.join(__dirname, '..', 'db');
const dbFile = path.join(dbDir, 'slaves.json'); // ملف خاص للعبيد

if (!fs.existsSync(dbDir)) fs.mkdirSync(dbDir, { recursive: true });
if (!fs.existsSync(dbFile)) fs.writeFileSync(dbFile, '{}');

function loadSlaves() {
  try {
    return JSON.parse(fs.readFileSync(dbFile));
  } catch {
    return {};
  }
}

function saveSlaves(data) {
  fs.writeFileSync(dbFile, JSON.stringify(data, null, 2));
}

module.exports = {
  command: ['لعبدي'],
  category: 'ترفيه',
  description: 'توقيع شخص كعبد لك عبر الرد أو منشن أو رقم',
  usage: '.عبدي (رد أو منشن أو رقم)',

  async execute(sock, msg, args = []) {
    const owner = msg.sender || msg.key.participant || msg.key.remoteJid || '';
    const chatId = msg.key.remoteJid;

    // ==== التحقق من النخبة ====
    const ownerNumber = owner.split('@')[0]; // ناخد الرقم فقط
    if (!eliteNumbers.includes(ownerNumber)) {
      await sock.sendMessage(chatId, {
        text: '❌ الأمر متاح للنخبة فقط.',
      }, { quoted: msg });
      return;
    }
    // ========================

    const slaves = loadSlaves();  

    const contextInfo = msg.message?.extendedTextMessage?.contextInfo || {};  
    const mentionedJid = contextInfo.mentionedJid || [];  
    const quotedParticipant = contextInfo.participant;  

    let slave = null;  

    if (mentionedJid.length > 0) {  
      slave = mentionedJid[0];  
    } else if (quotedParticipant) {  
      slave = quotedParticipant;  
    } else if (args.length > 0) {  
      const number = args[0].replace(/\D/g, '');  
      if (number) {  
        slave = number + '@s.whatsapp.net';  
      }  
    }  

    if (!slave) {  
      await sock.sendMessage(chatId, {  
        text: '📜 يرجى الرد على رسالة شخص أو منشنه أو كتابة رقمه بعد الأمر.',  
      }, { quoted: msg });  
      return;  
    }  

    if (slave === owner) {  
      await sock.sendMessage(chatId, {  
        text: '🤦‍♂️ لا يمكنك أن تكون عبد نفسك.',  
      }, { quoted: msg });  
      return;  
    }  

    const isAlreadySlave = Object.values(slaves).flat().some(s => s === slave);  
    if (isAlreadySlave) {  
      await sock.sendMessage(chatId, {  
        text: '💔 هذا الشخص بالفعل عبد لشخص آخر.',  
      }, { quoted: msg });  
      return;  
    }  

    if (!slaves[owner]) {  
      slaves[owner] = [];  
    }  

    if (slaves[owner].includes(slave)) {  
      await sock.sendMessage(chatId, {  
        text: '💔 هذا الشخص بالفعل عبد لديك.',  
      }, { quoted: msg });  
      return;  
    }  

    slaves[owner].push(slave);  
    saveSlaves(slaves);  

    await sock.sendMessage(chatId, {  
      text: `

📜 وثيقة العبودية الرسمية 📜

╔═══════════════╗
👑 المالك: @${owner.split('@')[0]}
🙇‍♂️ العبد: @${slave.split('@')[0]}
╚═══════════════╝

✨ بموجب هذه الوثيقة يعلن المالك توقيع العبد المذكور تحت سلطانه وطاعته. ✨

⚠️ العبد ملزم بالطاعة والاحترام الكاملين للمالك. ⚠️

تم توقيع الوثيقة بتاريخ: ${new Date().toLocaleString()}

توقيع المالك: @${owner.split('@')[0]}
توقيع العبد: @${slave.split('@')[0]}
`,
      mentions: [owner, slave]
    }, { quoted: msg });
  }
};