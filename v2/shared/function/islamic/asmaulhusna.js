import fs from "fs";
import filepath from "#func/namefile.js";
import json from "./islamic_dataset.json" with { type: "json" };

export default async function asmaulhusna({remoteJid, sock, text, msg}) {
    try {
        const isiTeks = text.replace('.asmaulhusna', '').trim();
        const index = parseInt(isiTeks);
        if (!isiTeks || isNaN(index) || index < 1 || index > 99) {
            return await sock.sendMessage(remoteJid, {
                text: "Ketik urutannya! Contoh: *.asmaulhusna 10* (Pilih angka 1 - 99)"
            });
        }
        const asmaulhusna = json.asmaul_husna[isiTeks];
        if (!asmaulhusna) {
            return await sock.sendMessage(remoteJid, { text: "Data tidak ditemukan." });
        }
        const format =
            `✨ *Asmaul Husna Ke-${isiTeks}* ✨\n\n` +
            `*Nama:* ${asmaulhusna.nama}\n` +
            `*Arab:* ${asmaulhusna.arab}\n` +
            `*Arti:* ${asmaulhusna.arti}\n\n` +
            `*Deskripsi:* \n${asmaulhusna.deskripsi}`;
        await sock.sendMessage(remoteJid, { text: format }, { quoted: msg });
    } catch (err) {
        console.error(err);
        await sock.sendMessage(remoteJid, { text: 'Terjadi kesalahan saat memuat data.' });
    }
}