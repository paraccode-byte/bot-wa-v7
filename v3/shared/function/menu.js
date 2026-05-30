import { menu } from "./helper.js";
import fs from "fs";

export default async function menuf({remoteJid, sock, msg}) {
    try {
        const data = JSON.parse(fs.readFileSync('./database/person_data.json'));
        await sock.sendMessage(remoteJid, {
            image: { url: data.image },
            caption: menu(data.name)
        }, { quoted: msg }
        );
    } catch (err) {
        console.error('Gagal membaca database:', err.message);
        await sock.sendMessage(remoteJid, { text: 'Maaf, menu sedang tidak tersedia.' });
    }
}