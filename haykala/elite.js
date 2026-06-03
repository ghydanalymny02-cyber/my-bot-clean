import fs from 'fs';
import path from 'path';

export let eliteNumbers = [
  '967700821174',
  '967715677073',
  '19405316558860',
  '9118903492798',
  '191813809872995',
  '136597844553964',
  '272344446701714',
  '270020735139962',
  '247850415968333',
  '155074609328172',
  '967778655633',
  '218923895144662',
  '3342323462246',
  '967780831387',
  '121711588589821',
  '269196084666587',
  '967717548443',
  '128708023161043',
  '85277397774503',
  '967716498780',
  '6262766981328',
  '967717540582',
  '166039862173751',
  '212438427406559',
  '967776315818',
  '278426271375586',
  '178009785012383',
  '967774898600',
  '90938047209692',
  '187708072800294',
  '88846448488569',
  '52450845298835'
];

export const extractPureNumber = (jid) => {
  return jid.toString().replace(/[@:].*/g, '');
};

export const isElite = (number) => {
  if (!number) return false;
  const pureNumber = extractPureNumber(number);
  const isMatch = eliteNumbers.includes(pureNumber);
  console.log(`Elite check: ${number} -> ${pureNumber} -> ${isMatch}`);
  return isMatch;
};

export const updateEliteNumbers = () => {
  const elitePath = path.join(process.cwd(), 'haykala', 'elite.js');
  const numbersStr = eliteNumbers.map(num => `'${num}'`).join(',\n  ');
  const newContent = `import fs from 'fs';\nimport path from 'path';\n\nexport let eliteNumbers = [\n  ${numbersStr}\n];\n\nexport const extractPureNumber = (jid) => {\n  return jid.toString().replace(/[@:].*/g, '');\n};\n\nexport const isElite = (number) => {\n  if (!number) return false;\n  const pureNumber = extractPureNumber(number);\n  const isMatch = eliteNumbers.includes(pureNumber);\n  console.log(\`Elite check: \${number} -> \${pureNumber} -> \${isMatch}\`);\n  return isMatch;\n};\n\nexport const updateEliteNumbers = ${updateEliteNumbers.toString()};\n\nexport const addEliteNumber = ${addEliteNumber.toString()};\n\nexport const removeEliteNumber = ${removeEliteNumber.toString()};\n`;

  fs.writeFileSync(elitePath, newContent);
  console.log('✅ تم تحديث قائمة النخبة تلقائيًا.');
};

export const addEliteNumber = (number) => {
  if (!eliteNumbers.includes(number)) {
    eliteNumbers.push(number);
    updateEliteNumbers();
  }
};

export const removeEliteNumber = (number) => {
  const index = eliteNumbers.indexOf(number);
  if (index > -1) {
    eliteNumbers.splice(index, 1);
    updateEliteNumbers();
  }
};
