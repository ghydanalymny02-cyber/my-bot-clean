const fs = require('fs');
const path = require('path');
const { eliteNumbers } = require('../haykala/elite.js');

function levenshteinDistance(a, b) {
  if (!a.length) return b.length;
  if (!b.length) return a.length;
  const matrix = [];
  for (let i = 0; i <= b.length; i++) matrix[i] = [i];
  for (let j = 0; j <= a.length; j++) matrix[0][j] = j;
  for (let i = 1; i <= b.length; i++) {
    for (let j = 1; j <= a.length; j++) {
      matrix[i][j] = (b[i - 1] === a[j - 1])
        ? matrix[i - 1][j - 1]
        : Math.min(
            matrix[i - 1][j - 1] + 1,
            matrix[i][j - 1] + 1,
            matrix[i - 1][j] + 1
          );
    }
  }
  return matrix[b.length][a.length];
}

function findClosestMatch(input, options, maxDistance = 3) {
  let closest = null, minDistance = Infinity;
  for (const option of options) {
    const distance = levenshteinDistance(input.toLowerCase(), option.toLowerCase());
    if (distance < minDistance && distance <= maxDistance) {
      minDistance = distance;
      closest = option;
    }
  }
  return closest;
}

module.exports = {
  command: ['باتش/وصف'],
  description: 'تعديل command أو description أو category أو usage داخل ملفات الإضافات 📝',
  category: 'ادوات',

  async execute(sock, msg) {
    const sender = msg.key.participant || msg.key.remoteJid;
    const senderNumber = sender.split('@')[0];
    if (!eliteNumbers.includes(senderNumber)) {
      return sock.sendMessage(msg.key.remoteJid, { text: '*◞⁉️┆هذا الأمر مخصص للنخبة فقط ◜*' }, { quoted: msg });
    }

    const pluginsDir = path.resolve('./plugins');
    const pluginFiles = fs.readdirSync(pluginsDir).filter(f => f.endsWith('.js') && !f.startsWith('_'));
    const pluginNames = pluginFiles.map(v => v.replace('.js', ''));

    const fullText = msg.message?.conversation || msg.message?.extendedTextMessage?.text || '';
    const commandName = fullText.split(' ')[0]?.toLowerCase();
    const args = fullText.slice(commandName.length).trim().split(/\s+/);

    if (args.length < 3) {
      const pluginList = pluginNames.map((v, i) => `${(i + 1).toString().padEnd(3)}. ${v}`).join('\n');
      return sock.sendMessage(msg.key.remoteJid, {
        text: `
*◞📂┆قائمة بكل ملفات الأضافة◜*
⸄࿆࿆⸅ྃ⸄࿆⸅⸄῁̟࿆⸅ྃ⸄῁࿆⸅⸄῁̟࿆⸅ྃ⸄῁࿆⸅⸄῁̟࿆⸅ྃ⸄῁࿆⸅⸄῁̟࿆ ⸅𓊆†𓊇⸄῁࿆⸅⸄῁̟࿆⸅ྃ⸄῁࿆⸅⸄῁̟࿆⸅⸄῁࿆⸅⸄῁̟࿆⸅ྃ⸄῁࿆⸅⸄῁̟࿆⸅ྃ⸄࿆⸅⸄࿆࿆⸅ྃ
*◞🗃️┆الإجمالي هو : ${pluginNames.length} ملف◜*
⸄࿆࿆⸅ྃ⸄࿆⸅⸄῁̟࿆⸅ྃ⸄῁࿆⸅⸄῁̟࿆⸅ྃ⸄῁࿆⸅⸄῁̟࿆⸅ྃ⸄῁࿆⸅⸄῁̟࿆ ⸅𓊆†𓊇⸄῁࿆⸅⸄῁̟࿆⸅ྃ⸄῁࿆⸅⸄῁̟࿆⸅⸄῁࿆⸅⸄῁̟࿆⸅ྃ⸄῁࿆⸅⸄῁̟࿆⸅ྃ⸄࿆⸅⸄࿆࿆⸅ྃ
${pluginList}
⸄࿆࿆⸅ྃ⸄࿆⸅⸄῁̟࿆⸅ྃ⸄῁࿆⸅⸄῁̟࿆⸅ྃ⸄῁࿆⸅⸄῁̟࿆⸅ྃ⸄῁࿆⸅⸄῁̟࿆ ⸅𓊆†𓊇⸄῁࿆⸅⸄῁̟࿆⸅ྃ⸄῁࿆⸅⸄῁̟࿆⸅⸄῁࿆⸅⸄῁̟࿆⸅ྃ⸄῁࿆⸅⸄῁̟࿆⸅ྃ⸄࿆⸅⸄࿆࿆⸅ྃ
*◞💡┆الأسـتـخـدام◜*
*◞مثال┆.باتش-وصف 1 2 + التعديل جديد للوصف◜*
> *◞الرقم الاول هو رقم الكود اما الرقم الثاني فهو رقم احد خانات الوصف الواجب تعديلها◜*
*1 = command*
*2 = description*
*3 = category*
*4 = usage*
        `.trim()
      }, { quoted: msg });
    }

    let targetFile = '';
    const fileSelector = args[0];
    const fieldNumber = parseInt(args[1]);
    const newValue = args.slice(2).join(' ');

    if (/^\d+$/.test(fileSelector)) {
      const index = parseInt(fileSelector) - 1;
      if (index >= 0 && index < pluginNames.length) {
        targetFile = pluginNames[index];
      } else {
        return sock.sendMessage(msg.key.remoteJid, { text: `*◞‼️┆الرقم غير صحيح! اختر بين 1 و ${pluginNames.length}◜*` }, { quoted: msg });
      }
    } else {
      if (pluginNames.includes(fileSelector)) {
        targetFile = fileSelector;
      } else {
        const closest = findClosestMatch(fileSelector, pluginNames);
        if (!closest) {
          return sock.sendMessage(msg.key.remoteJid, { text: `*◞‼️┆الملف "${fileSelector}" غير موجود◜*` }, { quoted: msg });
        }
        targetFile = closest;
      }
    }

    const filePath = path.join(pluginsDir, `${targetFile}.js`);
    let content = fs.readFileSync(filePath, 'utf8');

    const fields = {
      1: 'command',
      2: 'description',
      3: 'category',
      4: 'usage'
    };

    const fieldName = fields[fieldNumber];
    if (!fieldName) {
      return sock.sendMessage(msg.key.remoteJid, { text: '*◞⭕┆رقم الحقل غير صحيح فقط من 1 ← 4◜*' }, { quoted: msg });
    }

    const regex = new RegExp(`(${fieldName}\\s*:\\s*)(\\[[^\\]]*\\]|['"\`][^'"\`]*['"\`]|[^,\\n]*)(,?)`, 'm');

    if (regex.test(content)) {
  if (fieldName === 'command') {
    content = content.replace(regex, `$1['${newValue}']$3`);
  } else {
    content = content.replace(regex, `$1'${newValue}'$3`);
  }
} else {
  if (fieldName === 'command') {
    content = content.replace(/module\.exports\s*=\s*{/, match => `${match}\n  command: ['${newValue}'],`);
  } else {
    content = content.replace(/module\.exports\s*=\s*{/, match => `${match}\n  ${fieldName}: '${newValue}',`);
  }
    }

    try {
      fs.writeFileSync(filePath, content, 'utf8');
      await sock.sendMessage(msg.key.remoteJid, { text: `*◞✅┆تم تعديل ${fieldName} في الملف ${targetFile}.js  إلى : \n${newValue}◜*` }, { quoted: msg });
    } catch (err) {
      await sock.sendMessage(msg.key.remoteJid, { text: `*◞⚠️┆فشل تعديل الملف: ${err.message}◜*` }, { quoted: msg });
    }
  }
};