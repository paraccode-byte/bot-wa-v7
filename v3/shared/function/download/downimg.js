import download from './downloadMedsos.js';
import { downImg } from '../menu_array.js';

export default async function downimg({ msg, text, remoteJid, sock }) {
    const downimg_ms = downImg.find(d => text.startsWith(d.command));
    try {
        const url_awwl = text.replace(downimg_ms.command, '').trim();
        if (!url_awwl) {
            return sock.sendMessage(remoteJid, {
                text: `Masukan link nya!\nContoh: ${downimg_ms.command} ${downimg_ms.contohUrl}`
            });
        }
        await sock.sendMessage(remoteJid, { text: "_Sedang memproses..._" });
        const buffer = await download(url_awwl, downimg_ms.varname, downimg_ms.lokasi);
        await sock.sendMessage(remoteJid, {
            image: buffer,
            caption: `✅ Berhasil didownload`,
        }, { quoted: msg });
    } catch (error) {
        console.error("Error Detail:", error.message);
        await sock.sendMessage(remoteJid, {
            text: `❌ Gagal: ${error.message}`
        });
    }
}