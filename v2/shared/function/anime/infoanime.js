import { cari_anim } from "../menu_array.js";
import search_Anime from "./search.js";

async function get_info(get, text) {
    try {
        const need_info = cari_anim.find(e => e.msg === get);
        const info = await search_Anime(text);
        if (!info) return null;
        let dataTampil = info[need_info.value];
        if (Array.isArray(dataTampil)) {
            dataTampil = dataTampil.join(', ');
        }
        const format =
            `Ini informasi yang anda butuhkan:\n\n` +
            `*${info.title}*\n` + 
            `> ${need_info.value.toUpperCase()}:\n` +
            `${dataTampil || 'data tidak di temukan'}`;

        return format
    } catch (error) {
        console.error(error);
        return null;
    }
}
export default async function infoanime({ remoteJid, sock, text, msg }) {
    const info_anim_ms = cari_anim.find(c => text.startsWith(c.msg))?.msg;
    try {
        const isiTeks = text.replace(info_anim_ms, '').trim();
        if (!isiTeks) return await sock.sendMessage(remoteJid, { text: `Ketik nama anime! contoh nya: ${info_anim_ms} roshindere` });
        const answer = await get_info(text.replace(isiTeks, '').trim(), isiTeks)
        if (!answer) return await sock.sendMessage(remoteJid, { text: 'Anime tidak di temukan!' })
        await sock.sendMessage(remoteJid, { text: answer }, { quoted: msg })
    } catch (err) {
        console.error(err);
        await sock.sendMessage(remoteJid, { text: 'Gagal membuat jawaban.' });
    }
}