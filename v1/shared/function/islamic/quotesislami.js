import fs from 'fs';
import json from "./islamic_dataset.json" with { type: "json" };

export default async function quotesislami({remoteJid, sock, msg}) {
    try {
        const allQuotes = json.quotes[0];
        const angka_random = Math.floor(Math.random() * 7) + 1;
        const quoteText = allQuotes[angka_random.toString()];
        if (!quoteText) {
            return await sock.sendMessage(remoteJid, { text: "Data tidak ditemukan." });
        }
        const format = `✨ *Quotes hari ini*\n\n` + `"${quoteText}"`;
        await sock.sendMessage(remoteJid, { text: format }, { quoted: msg });
    } catch (err) {
        console.error(err);
        await sock.sendMessage(remoteJid, { text: 'Terjadi kesalahan saat memuat data.' });
    }
}