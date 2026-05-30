import fs from "fs";
import json from "./islamic_dataset.json" with { type: "json" };

export default async function bacaansholat({remoteJid, sock, text, msg}) {
    try {
        const isiTeks = text.replace('.bacaansholat', '').trim();
        const index = parseInt(isiTeks);
        if (!isiTeks || isNaN(index) || index < 1 || index > 9) {
            return await sock.sendMessage(remoteJid, {
                text: "Ketik urutannya! Contoh: *.bacaansholat 5* (Pilih angka 1 - 9)"
            });
        }
        const bacaan_sholat = json.bacaan_sholat[isiTeks];
        if (!bacaan_sholat) {
            return await sock.sendMessage(remoteJid, { text: "Data tidak ditemukan." });
        }
        const format =
            `✨ *Bacaan sholat\n\n` +
            `*Nama:* ${bacaan_sholat.nama}\n` +
            `*Arab:* ${bacaan_sholat.arab}\n` +
            `*Latin:* ${bacaan_sholat.latin}\n\n` +
            `*Arti:* \n${bacaan_sholat.arti}`;
        await sock.sendMessage(remoteJid, { text: format }, { quoted: msg });
    } catch (err) {
        console.error(err);
        await sock.sendMessage(remoteJid, { text: 'Terjadi kesalahan saat memuat data.' });
    }
}