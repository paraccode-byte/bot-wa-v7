import fs from "fs";
import json from "./islamic_dataset.json" with { type: "json" };

export default async function doaharian({remoteJid, sock, text, msg}) {
    try {
        const isiTeks = text.replace('.doaharian', '').trim();
        const index = parseInt(isiTeks);
        if (!isiTeks || isNaN(index) || index < 1 || index > 11) {
            return await sock.sendMessage(remoteJid, {
                text: "Ketik urutannya! Contoh: *.doaharian 7* (Pilih angka 1 - 11)"
            });
        }
        const doa_harian = json.doa_harian[isiTeks];
        if (!doa_harian) {
            return await sock.sendMessage(remoteJid, { text: "Data tidak ditemukan." });
        }
        const format =
            `✨ *Doa harian\n\n` +
            `*Nama:* ${doa_harian.nama}\n` +
            `*Arab:* ${doa_harian.arab}\n` +
            `*Latin:* ${doa_harian.latin}\n\n` +
            `*Arti:* \n${doa_harian.arti}`;
        await sock.sendMessage(remoteJid, { text: format }, { quoted: msg });
    } catch (err) {
        console.error(err);
        await sock.sendMessage(remoteJid, { text: 'Terjadi kesalahan saat memuat data.' });
    }
}