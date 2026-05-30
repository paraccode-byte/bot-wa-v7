import fs from "fs";
import json from "./islamic_dataset.json" with { type: "json" };

export default async function kisahnabi({remoteJid, sock, text, msg}) {
    try {
        const isiTeks = text.replace('.kisahnabi', '').trim().toLowerCase(); 
        if (!isiTeks) return await sock.sendMessage(remoteJid, { text: "Ketik nama nabi! contoh: .kisahnabi adam" });

        const data_nabi = json.prophet_story[isiTeks];

        if (!data_nabi) {
            return await sock.sendMessage(remoteJid, { text: `Data nabi "${isiTeks}" tidak ditemukan.` });
        }

        const format = `✨ *Kisah ${data_nabi.nama}* ✨\n\n` +
            `📍 *Tempat Lahir:* ${data_nabi.tempat_lahir}\n` +
            `⏳ *Usia:* ${data_nabi.usia}\n` +
            `🛡️ *Mukjizat:* ${data_nabi.mukjizat}\n\n` +
            `📖 *Kisah:* \n${data_nabi.kisah_lengkap}`;

        await sock.sendMessage(remoteJid, { text: format }, { quoted: msg });

    } catch (err) {
        console.error(err);
        await sock.sendMessage(remoteJid, { text: 'Terjadi kesalahan sistem saat memuat data.' });
    }
}