import fs from "fs";
import json from "./islamic_dataset.json" with { type: "json" };
export default async function niatsholat({remoteJid, sock, text, msg}) {
    try {
        const isiTeks = text.replace('.niatsholat', '').trim();
        const index = parseInt(isiTeks);
        if (!isiTeks || isNaN(index) || index < 1 || index > 5) {
            return await sock.sendMessage(remoteJid, {
                text: "Ketik urutan solat! Contoh: *.niatsholat 3* (Pilih angka 1 - 5)"
            });
        }
        const niat_sholat_wajib = json.niat_sholat_wajib[isiTeks];
        if (!niat_sholat_wajib) {
            return await sock.sendMessage(remoteJid, { text: "Data tidak ditemukan." });
        }
        const format =
            `✨ *Niat sholat\n\n` +
            `*Nama:* ${niat_sholat_wajib.nama}\n` +
            `*Arab:* ${niat_sholat_wajib.arab}\n` +
            `*Latin:* ${niat_sholat_wajib.latin}\n\n` +
            `*Arti:* \n${niat_sholat_wajib.arti}`;
        await sock.sendMessage(remoteJid, { text: format }, { quoted: msg });
    } catch (err) {
        console.error(err);
        await sock.sendMessage(remoteJid, { text: 'Terjadi kesalahan saat memuat data.' });
    }
}