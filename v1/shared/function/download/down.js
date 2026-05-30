import download from './downloadMedsos.js';
import { downSosmed } from '../menu_array.js';

export default async function down({ msg, text, remoteJid, sock }) {
    const downs_ms = downSosmed.find(d => text.startsWith(d.command));
    if (!downs_ms) return sock.sendMessage(remoteJid, {
        text: `Masukan link nya!\nContoh: .downtiktok https://vt.tiktok.com/ZSsdsds`
    });
    try {
        const url_awwl = text.replace(downs_ms.command, '').trim();
        if (!url_awwl) {
            return sock.sendMessage(remoteJid, {
                text: `Masukan link nya!\nContoh: ${downs_ms.command} ${downs_ms.contohUrl}`
            });
        }
        await sock.sendMessage(remoteJid, { text: "_Sedang memproses..._" });
        const buffer = await download(url_awwl, downs_ms.varname, downs_ms.lokasi);
        await sock.sendMessage(remoteJid, {
            video: buffer,
            caption: `✅ Berhasil didownload`,
            mimetype: 'video/mp4'
        }, { quoted: msg });
    } catch (error) {
        console.error("Error Detail:", error.message);
        await sock.sendMessage(remoteJid, {
            text: `❌ Gagal: ${error.message}`
        });
    }
}