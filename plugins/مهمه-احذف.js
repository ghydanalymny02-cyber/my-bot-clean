const fs = require('fs');
const path = require('path');

const file = path.join(__dirname, '../data/tasks.json');
if (!fs.existsSync(file)) fs.writeFileSync(file, JSON.stringify({}));

function loadTasks() {
  return JSON.parse(fs.readFileSync(file));
}

function saveTasks(data) {
  fs.writeFileSync(file, JSON.stringify(data, null, 2));
}

module.exports = {
  command: 'مهمه-احذف',
  category: 'tools',
  description: 'حذف مهمة من مهامك عبر الكود',
  usage: '•حذف_مهمة [كود المهمة]',
  execute: async (sock, msg) => {
    const sender = msg.key.remoteJid;

    const fullText = msg.message?.conversation || msg.message?.extendedTextMessage?.text || '';
    const taskId = fullText.split(' ').slice(1).join(' ').trim();

    if (!taskId) {
      return await sock.sendMessage(sender, {
        text: '❗ اكتب كود المهمة التي تريد حذفها.\nمثال:\n•حذف_مهمة TASK-123456',
      }, { quoted: msg });
    }

    const tasks = loadTasks();
    if (!tasks[sender]) return await sock.sendMessage(sender, { text: '❗ لا توجد لديك أي مهام بعد.' }, { quoted: msg });

    const index = tasks[sender].findIndex(t => t.id === taskId);
    if (index === -1) {
      return await sock.sendMessage(sender, {
        text: `❌ لم يتم العثور على مهمة بالكود: ${taskId}`,
      }, { quoted: msg });
    }

    const removed = tasks[sender].splice(index, 1)[0];
    saveTasks(tasks);

    await sock.sendMessage(sender, {
      text: `✅ تم حذف المهمة:\n📌 ${removed.text}`,
    }, { quoted: msg });
  }
};