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
  command: 'مهمتي',
  category: 'الدراسة',
  description: 'أضف مهمة دراسية إلى قائمتك',
  usage: '•اضف_مهمة [نص المهمة]',
  execute: async (sock, msg) => {
    const sender = msg.key.remoteJid;

    // التحقق من نص الرسالة نفسها
    const fullText = msg.message?.conversation || msg.message?.extendedTextMessage?.text || '';
    const text = fullText.split(' ').slice(1).join(' ').trim(); // حذف اسم الأمر من البداية

    if (!text) {
      return await sock.sendMessage(sender, {
        text: '❗ اكتب نص المهمة بعد الأمر.\nمثال:\n•اضف_مهمة حل واجب الرياضيات',
      }, { quoted: msg });
    }

    const tasks = loadTasks();
    if (!tasks[sender]) tasks[sender] = [];

    const taskId = `TASK-${Date.now().toString().slice(-6)}`;
    tasks[sender].push({ id: taskId, text });
    saveTasks(tasks);

    await sock.sendMessage(sender, {
      text: `✅ تمت إضافة المهمة:\n📌 ${text}\n🆔 كود المهمة: ${taskId}`,
    }, { quoted: msg });
  }
};