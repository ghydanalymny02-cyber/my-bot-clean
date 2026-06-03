const fs = require('fs');
const path = require('path');
const { isElite, extractPureNumber } = require('../haykala/elite.js');

const dataFile = path.join(__dirname, '../data/disabled-forward.json');

// تحميل قائمة الجروبات المستبعدة
function loadDisabledGroups() {
  if (!fs.existsSync(dataFile)) return [];
  try {
    return JSON.parse(fs.readFileSync(dataFile, 'utf8'));
  } catch (e) {
    return [];
  }
}

// حفظ قائمة الجروبات المستبعدة
function saveDisabledGroups(groups) {
  fs.writeFileSync(dataFile, JSON.stringify(groups, null, 2));
}

module.exports = {
  command: 'توجيه',
  description: '📣 توجيه رسالة إلى كل الجروبات (مع استثناء جروبات معينة)',
  category: 'DEVELOPER',

  async execute(sock, msg) {
    const sender = msg.sender || msg.key.participant || msg.key.remoteJid;
    if (!sender) return await sock.sendMessage(msg.key.remoteJid, {
      text: '❌ تعذر معرفة المرسل.',
    }, { quoted: msg });

    if (!(isElite(sender) || extractPureNumber(sender) === '963996097873')) {
      return await sock.sendMessage(msg.key.remoteJid, {
        text: '🚫 هذا الأمر مخصص للنخبة فقط.',
      }, { quoted: msg });
    }

    // ناخد الكلام اللي بعد الكوماند
    const body = msg.message?.conversation || msg.message?.extendedTextMessage?.text || '';
    const input = body.trim().split(/\s+/).slice(1); // أول كلمة بتكون الكوماند نفسه، نشيله

    const groupsMetadata = await sock.groupFetchAllParticipating();
    const groupJids = Object.keys(groupsMetadata).filter(gid => gid.endsWith('@g.us'));

    if (groupJids.length === 0) {
      return await sock.sendMessage(msg.key.remoteJid, {
        text: '❌ البوت ليس في أي جروب.',
      }, { quoted: msg });
    }

    let disabledGroups = loadDisabledGroups();

    // حالة لو كتب .توجيه بدون
    if (input[0] === 'بدون') {
      if (!input[1]) {
        // عرض قائمة الجروبات
        let list = groupJids.map((gid, i) => {
          const meta = groupsMetadata[gid];
          const name = meta.subject || 'جروب بدون اسم';
          const excluded = disabledGroups.includes(gid) ? '🚫' : '✅';
          return `${i + 1}- ${name} ${excluded}`;
        }).join('\n');

        return await sock.sendMessage(msg.key.remoteJid, {
          text: `📋 قائمة الجروبات:\n\n${list}\n\nℹ️ 🚫 = مستبعد من التوجيه، ✅ = شغال`,
        }, { quoted: msg });
      } else {
        // استبعاد/إلغاء استبعاد جروب معين
        const index = parseInt(input[1]) - 1;
        if (isNaN(index) || index < 0 || index >= groupJids.length) {
          return await sock.sendMessage(msg.key.remoteJid, {
            text: '⚠️ رقم الجروب غير صحيح.',
          }, { quoted: msg });
        }

        const targetGroup = groupJids[index];
        if (!disabledGroups.includes(targetGroup)) {
          disabledGroups.push(targetGroup);
          saveDisabledGroups(disabledGroups);
          return await sock.sendMessage(msg.key.remoteJid, {
            text: `🚫 تم استبعاد الجروب (${groupsMetadata[targetGroup].subject}) من التوجيه.`,
          }, { quoted: msg });
        } else {
          disabledGroups = disabledGroups.filter(g => g !== targetGroup);
          saveDisabledGroups(disabledGroups);
          return await sock.sendMessage(msg.key.remoteJid, {
            text: `✅ تم إعادة تفعيل التوجيه في الجروب (${groupsMetadata[targetGroup].subject}).`,
          }, { quoted: msg });
        }
      }
    }

    // باقي الكود: لو عايز يوجه رسالة
    const context = msg.message?.extendedTextMessage?.contextInfo;
    const quotedMsg = context?.quotedMessage;

    if (!quotedMsg) {
      return await sock.sendMessage(msg.key.remoteJid, {
        text: '❌ يجب الرد على رسالة نصية لتوجيهها.\nاو استخدم `.توجيه بدون` لعرض وإدارة الجروبات المستبعدة.',
      }, { quoted: msg });
    }

    const text = quotedMsg?.conversation || quotedMsg?.extendedTextMessage?.text;
    if (!text) {
      return await sock.sendMessage(msg.key.remoteJid, {
        text: '⚠️ الرسالة التي تم الرد عليها لا تحتوي على نص.',
      }, { quoted: msg });
    }

    const enabledGroups = groupJids.filter(g => !disabledGroups.includes(g));

    await sock.sendMessage(msg.key.remoteJid, {
      text: `🔄 جاري توجيه الرسالة إلى ${enabledGroups.length} جروب (المستبعدين ${disabledGroups.length})...`,
    }, { quoted: msg });

    for (const group of enabledGroups) {
      try {
        const metadata = groupsMetadata[group];
        const mentions = metadata.participants.map(p => p.id);

        await sock.sendMessage(group, {
          text: `📢 *رسالة موجهة من المطور:*\n\n${text}`,
          mentions
        });

        await new Promise(resolve => setTimeout(resolve, 1000));
      } catch (err) {
        console.log(`⚠️ فشل التوجيه إلى ${group}: ${err.message}`);
      }
    }

    await sock.sendMessage(msg.key.remoteJid, {
      text: '✅ تم توجيه الرسالة مع مراعاة الجروبات المستبعدة.',
    }, { quoted: msg });
  }
};