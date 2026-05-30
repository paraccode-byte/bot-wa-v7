import upload_file from "./upload_file.js";
import fs from "fs";
import message from "./fail.json" with { type: "json" };
import { type } from "os";

function edit(url, caption, type, file) {
    fs.writeFileSync(`./database/${file}.json`, JSON.stringify({
        url: url,
        caption: caption,
        type: type
    }));
};
export async function setwelcome({ remoteJid, sock, text, grupIndex, msgType, msg, downloadMediaMessage }) {
    const caption = text.replace('.setwelcome', '').trim();
    if (!caption) return await sock.sendMessage(remoteJid, { text: message.welcome })
    const file = 'welcome';
    if (msgType === 'imageMessage') {
        try {
            const buffer = await downloadMediaMessage(msg, 'buffer', {}, { logger: console, reuploadRequest: sock.updateMediaMessage });
            const url = await upload_file(buffer, "image");
            edit(url, caption, 'image', file);
            await sock.sendMessage(remoteJid, {
                text: `✅ Pesan welcome berhasil diperbarui!\n\nTipe: media image\nteks: ${caption}\nUrl media: ${url}`
            }, { quoted: msg });
        } catch (err) {
            console.error(err);
            await sock.sendMessage(remoteJid, { text: 'Gagal menyimpan file.' });
        }
    } else if (msgType === 'videoMessage') {
        try {
            const buffer = await downloadMediaMessage(msg, 'buffer', {}, { logger: console, reuploadRequest: sock.updateMediaMessage });
            const url = await upload_file(buffer, "video");
            edit(url, caption, 'video', file);
            await sock.sendMessage(remoteJid, {
                text: `✅ Pesan welcome berhasil diperbarui!\n\nTipe: media video\nteks: ${caption}\nUrl media: ${url}`
            }, { quoted: msg });

        } catch (err) {
            console.error(err);
            await sock.sendMessage(remoteJid, { text: 'Gagal menyimpan file.' });
        }
    } else {
        try {
            edit('', caption, 'plan', file);
            await sock.sendMessage(remoteJid, {
                text: `✅ Pesan welcome berhasil diperbarui!\n\nTipe: plan teks\nteks: ${caption}`
            }, { quoted: msg });
        } catch (err) {
            console.error(err);
            await sock.sendMessage(remoteJid, { text: 'Gagal menyimpan file.' });
        }
    }
}

export async function setleave({ remoteJid, sock, text, msgType, msg, downloadMediaMessage }) {
    const caption = text.replace('.setleave', '').trim();
    if (!caption) return await sock.sendMessage(remoteJid, { text: message.leave })
    const file = 'leave'
    if (msgType === 'imageMessage') {
        try {
            const buffer = await downloadMediaMessage(msg, 'buffer', {}, { logger: console, reuploadRequest: sock.updateMediaMessage });
            const url = await upload_file(buffer, "image");
            edit(url, caption, 'image', file);
            await sock.sendMessage(remoteJid, {
                text: `✅ Pesan leave berhasil diperbarui!\n\nTipe: media image\nteks: ${caption}\nUrl media: ${url}`
            }, { quoted: msg });

        } catch (err) {
            console.error(err);
            await sock.sendMessage(remoteJid, { text: 'Gagal menyimpan file.' });
        }
    } else if (msgType === 'videoMessage') {
        try {
            const buffer = await downloadMediaMessage(msg, 'buffer', {}, { logger: console, reuploadRequest: sock.updateMediaMessage });
            const url = await upload_file(buffer, "video");
            edit(url, caption, 'video', file);
            await sock.sendMessage(remoteJid, {
                text: `✅ Pesan leave berhasil diperbarui!\n\nTipe: media video\nteks: ${caption}\nUrl media: ${url}`
            }, { quoted: msg });

        } catch (err) {
            console.error(err);
            await sock.sendMessage(remoteJid, { text: 'Gagal menyimpan file.' });
        }
    } else {
        try {
            edit('', caption, 'plan', file);
            await sock.sendMessage(remoteJid, {
                text: `✅ Pesan leave berhasil diperbarui!\n\nTipe: plan teks\nteks: ${caption}`
            }, { quoted: msg });
        } catch (err) {
            console.error(err);
            await sock.sendMessage(remoteJid, { text: 'Gagal menyimpan file.' });
        }
    }
}