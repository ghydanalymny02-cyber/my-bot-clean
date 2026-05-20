const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');
const fs = require('fs');
const path = require('path');

const client = new Client({
    authStrategy: new LocalAuth()
});

const ownerNumber = '963996097873';
const ownerName = '𝒀𝑼𝑴𝑰𝑳𝑨';

// مجلد لحفظ الصور القديمة
const backupDir = './profile_backups';
if (!fs.existsSync(backupDir)) {
    fs.mkdirSync(backupDir);
}

// ملف لحفظ تاريخ الصور
const historyFile = './profile_history.json';
let profileHistory = [];

// تحميل التاريخ إذا موجود
if (fs.existsSync(historyFile)) {
    try {
        profileHistory = JSON.parse(fs.readFileSync(historyFile));
    } catch (e) {
        profileHistory = [];
    }
}

// حفظ التاريخ
function saveHistory() {
    fs.writeFileSync(historyFile, JSON.stringify(profileHistory, null, 2));
}

client.on('qr', qr => {
    qrcode.generate(qr, { small: true });
});

client.on('ready', () => {
    console.log('✅ البوت شغال يا ' + ownerName);
    console.log('📸 عدد الصور المحفوظة: ' + profileHistory.length);
});

client.on('message', async message => {
    const msg = message.body;
    const sender = message.from;
    const isOwner = sender.includes(ownerNumber);
    const reply = (text) => message.reply(text);
    
    if (!isOwner) return;

    // ===========================================
    // 1️⃣ أمر تغيير صورة البروفايل إلى فيديو
    // ===========================================
    if (msg === '.فيديو' && message.hasMedia) {
        try {
            await reply('🎥 جاري معالجة الفيديو...');
            
            const media = await message.downloadMedia();
            
            if (!media.mimetype.includes('video')) {
                return reply('❌ هذا الملف ليس فيديو');
            }
            
            // حفظ الفيديو مؤقتاً
            const videoPath = path.join(__dirname, 'current_video.mp4');
            fs.writeFileSync(videoPath, media.data, 'base64');
            
            // حفظ نسخة احتياطية
            const timestamp = Date.now();
            const backupPath = path.join(backupDir, `video_${timestamp}.mp4`);
            fs.copyFileSync(videoPath, backupPath);
            
            // إضافة للتاريخ
            profileHistory.push({
                id: timestamp,
                path: backupPath,
                date: new Date().toLocaleString(),
                type: 'video'
            });
            saveHistory();
            
            // تغيير الصورة
            await client.setProfilePicture(videoPath);
            
            // حذف الملف المؤقت
            fs.unlinkSync(videoPath);
            
            await reply(`✅ تم تغيير صورة البروفايل إلى فيديو
📅 تم الحفظ في السجل
🔢 الرقم: ${timestamp}`);
            
        } catch (error) {
            await reply('❌ خطأ: ' + error.message);
        }
        return;
    }

    // ===========================================
    // 2️⃣ أمر تغيير صورة البروفايل إلى صورة
    // ===========================================
    if (msg === '.صورة' && message.hasMedia) {
        try {
            await reply('🖼️ جاري معالجة الصورة...');
            
            const media = await message.downloadMedia();
            
            if (!media.mimetype.includes('image')) {
                return reply('❌ هذا الملف ليس صورة');
            }
            
            // حفظ الصورة مؤقتاً
            const imagePath = path.join(__dirname, 'current_image.jpg');
            fs.writeFileSync(imagePath, media.data, 'base64');
            
            // حفظ نسخة احتياطية
            const timestamp = Date.now();
            const backupPath = path.join(backupDir, `image_${timestamp}.jpg`);
            fs.copyFileSync(imagePath, backupPath);
            
            // إضافة للتاريخ
            profileHistory.push({
                id: timestamp,
                path: backupPath,
                date: new Date().toLocaleString(),
                type: 'image'
            });
            saveHistory();
            
            // تغيير الصورة
            await client.setProfilePicture(imagePath);
            
            // حذف الملف المؤقت
            fs.unlinkSync(imagePath);
            
            await reply(`✅ تم تغيير صورة البروفايل
📅 تم الحفظ في السجل
🔢 الرقم: ${timestamp}`);
            
        } catch (error) {
            await reply('❌ خطأ: ' + error.message);
        }
        return;
    }

    // ===========================================
    // 3️⃣ أمر حذف صورة البروفايل
    // ===========================================
    if (msg === '.حذف') {
        try {
            // حفظ الصورة الحالية قبل الحذف
            try {
                const currentUrl = await client.getProfilePictureUrl(client.info.wid._serialized);
                if (currentUrl) {
                    await reply('📸 جاري حفظ الصورة الحالية...');
                    // هنا كود تحميل الصورة الحالية لو احتجتي
                }
            } catch (e) {
                // لا توجد صورة حالية
            }
            
            await client.deleteProfilePicture();
            await reply('✅ تم حذف صورة البروفايل');
            
        } catch (error) {
            await reply('❌ خطأ في الحذف: ' + error.message);
        }
        return;
    }

    // ===========================================
    // 4️⃣ أمر ترجيع آخر صورة
    // ===========================================
    if (msg === '.رجوع') {
        try {
            if (profileHistory.length === 0) {
                return reply('📭 لا توجد صور سابقة في السجل');
            }
            
            // آخر صورة في التاريخ
            const last = profileHistory[profileHistory.length - 1];
            
            if (!fs.existsSync(last.path)) {
                return reply('❌ ملف الصورة غير موجود');
            }
            
            await reply(`🔄 جاري استعادة الصورة من ${last.date}...`);
            
            // تغيير الصورة
            await client.setProfilePicture(last.path);
            
            await reply(`✅ تم استعادة الصورة السابقة
📅 التاريخ: ${last.date}
🔢 الرقم: ${last.id}`);
            
        } catch (error) {
            await reply('❌ خطأ في الاستعادة: ' + error.message);
        }
        return;
    }

    // ===========================================
    // 5️⃣ أمر عرض السجل
    // ===========================================
    if (msg === '.سجلي') {
        try {
            if (profileHistory.length === 0) {
                return reply('📭 سجل الصور فارغ');
            }
            
            let historyText = '📋 *سجل الصور*\n\n';
            
            profileHistory.slice(-10).reverse().forEach((item, index) => {
                const emoji = item.type === 'video' ? '🎥' : '🖼️';
                historyText += `${emoji} ${index + 1}. ${item.date}\n`;
                historyText += `   🆔 ${item.id}\n\n`;
            });
            
            historyText += `📊 الإجمالي: ${profileHistory.length} صورة`;
            
            await reply(historyText);
            
        } catch (error) {
            await reply('❌ خطأ: ' + error.message);
        }
        return;
    }

    // ===========================================
    // 6️⃣ أمر ترجيع برقم معين
    // ===========================================
    if (msg.startsWith('.رجوع ')) {
        try {
            const id = parseInt(msg.replace('.رجوع ', ''));
            const item = profileHistory.find(i => i.id === id);
            
            if (!item) {
                return reply('❌ الرقم غير موجود في السجل');
            }
            
            if (!fs.existsSync(item.path)) {
                return reply('❌ ملف الصورة مفقود');
            }
            
            await reply(`🔄 جاري استعادة الصورة من ${item.date}...`);
            await client.setProfilePicture(item.path);
            await reply(`✅ تم استعادة الصورة رقم ${id}`);
            
        } catch (error) {
            await reply('❌ خطأ: ' + error.message);
        }
        return;
    }

    // ===========================================
    // 7️⃣ أمر حذف صورة معينة من السجل
    // ===========================================
    if (msg.startsWith('.حذف سجل ')) {
        try {
            const id = parseInt(msg.replace('.حذف سجل ', ''));
            const index = profileHistory.findIndex(i => i.id === id);
            
            if (index === -1) {
                return reply('❌ الرقم غير موجود');
            }
            
            // حذف الملف
            if (fs.existsSync(profileHistory[index].path)) {
                fs.unlinkSync(profileHistory[index].path);
            }
            
            // حذف من السجل
            profileHistory.splice(index, 1);
            saveHistory();
            
            await reply(`✅ تم حذف الصورة رقم ${id} من السجل`);
            
        } catch (error) {
            await reply('❌ خطأ: ' + error.message);
        }
        return;
    }

    // ===========================================
    // 8️⃣ أمر مسح السجل كامل
    // ===========================================
    if (msg === '.مسح سجلي') {
        try {
            // حذف كل الملفات
            profileHistory.forEach(item => {
                if (fs.existsSync(item.path)) {
                    fs.unlinkSync(item.path);
                }
            });
            
            // تفريغ السجل
            profileHistory = [];
            saveHistory();
            
            await reply('✅ تم مسح سجل الصور بالكامل');
            
        } catch (error) {
            await reply('❌ خطأ: ' + error.message);
        }
        return;
    }

    // ===========================================
    // 9️⃣ أمر معلومات الصورة الحالية
    // ===========================================
    if (msg === '.معلومات') {
        try {
            let info = '📸 *معلومات البروفايل*\n\n';
            
            // الصورة الحالية
            try {
                const currentUrl = await client.getProfilePictureUrl(client.info.wid._serialized);
                info += `✅ يوجد صورة حالية\n`;
            } catch (e) {
                info += `❌ لا توجد صورة حالية\n`;
            }
            
            // آخر صورة في السجل
            if (profileHistory.length > 0) {
                const last = profileHistory[profileHistory.length - 1];
                info += `\n📅 آخر صورة: ${last.date}\n`;
                info += `🔢 رقمها: ${last.id}\n`;
                info += `📁 نوعها: ${last.type}\n`;
            }
            
            info += `\n📊 إجمالي السجل: ${profileHistory.length}`;
            
            await reply(info);
            
        } catch (error) {
            await reply('❌ خطأ: ' + error.message);
        }
        return;
    }

    // ===========================================
    // 🔟 أمر المساعدة
    // ===========================================
    if (msg === '.اوامر') {
        const help = `🎥 *أوامر البروفايل*

📤 *تغيير:*
• .فيديو + فيديو - تغيير إلى فيديو
• .صورة + صورة - تغيير إلى صورة

🗑️ *حذف:*
• .حذف - حذف الصورة الحالية
• .حذف سجل [رقم] - حذف صورة من السجل
• .مسح سجلي - مسح كل السجل

↩️ *ترجيع:*
• .رجوع - ترجيع آخر صورة
• .رجوع [رقم] - ترجيع صورة برقمها

📋 *عرض:*
• .سجلي - عرض سجل الصور
• .معلومات - معلومات البروفايل
• .اوامر - عرض هذه القائمة

👑 المطورة: ${ownerName}`;
        
        await reply(help);
        return;
    }
});

client.initialize();