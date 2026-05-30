import fs from 'fs';
import path from "path";
import { fileURLToPath } from "url";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
function filepath(location) {
    return path.join(__dirname, location);
}

export default async function list({ remoteJid, sock, text, msg }) {
    const command = text.toLowerCase();
    const menuMap = {
        '.listgame': 11,
        '.game': 11,
        '.grup': 1,
        '.liststiker': 2,
        '.stiker': 2,
        '.chatanime': 12,
        '.anime': 13,
        '.islami': 4,
        '.image': 5,
        '.vidio': 6,
        '.msk': 10,
        '.topup': 7,
        '.pulsa': 8,
        '.data': 8,
        '.vcr': 9,
        '.token': 9,
        '.admin': 3,
        '.viddownload': 14,
        '.imgdownload': 15,
    };

    try {
        if (menuMap[command]) {
            const fileindex = menuMap[command];
            const teks = fs.readFileSync(filepath('../menu.txt'), 'utf-8');
            const matches = teks.match(/┏『[\s\S]*?┗━━━━━━━━━━━━━━━━⊱/g);
            await sock.sendMessage(remoteJid, { text: matches[fileindex] }, { quoted: msg });
        }
    } catch (err) {
        console.error('Gagal membaca file:', err.message);
        await sock.sendMessage(remoteJid, { text: "terjadi kesalah server" }, { quoted: msg });
    }
}