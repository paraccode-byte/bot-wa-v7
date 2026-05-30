import fs from "fs";
import json from "./islamic_dataset.json" with { type: "json" };

export default async function ayatkursi({remoteJid, sock, msg}) {
    try {

        const ayat_kursi = json.ayat_kursi[0];
        if (!ayat_kursi) {
            return await sock.sendMessage(remoteJid, { text: "Data tidak ditemukan." });
        }
        const format =
            `✨ *Ayat kursi\n\n` +
            `*Ayat:* ${ayat_kursi.arab}\n` +
            `*Latin:* ${ayat_kursi.latin}\n\n` +
            `*Arti:* \n${ayat_kursi.arti}`;
        await sock.sendMessage(remoteJid, { text: format }, { quoted: msg });
    } catch (err) {
        console.error(err);
        await sock.sendMessage(remoteJid, { text: 'Terjadi kesalahan saat memuat data.' });
    }
}