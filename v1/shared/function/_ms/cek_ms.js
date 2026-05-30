import { cek } from "../menu_array.js";

function handle_cek(command, name) {
    try {
        if (command === '.cekiq') {
            const iq = Math.floor(Math.random() * (93 - 78 + 1)) + 78;
            return `IQ ${name} adalah: ${iq}`;
        }

        if (command === '.cekjodoh' || command === 'cekjodoh') {
            const huruf = "abcdefghijklmnopqrstuvwxyz";
            const inisial = huruf[Math.floor(Math.random() * huruf.length)];
            return `Jodoh ${name} berinisial: ${inisial.toUpperCase()}`;
        }

        if (command === '.cekkodam' || command === 'cekkodam') {
            const kodam = ['Macan Putih', 'Naga', 'Ular', 'Macan Kumbang', 'Buaya Putih', 'Kecoak Kutub'];
            const hasil = kodam[Math.floor(Math.random() * kodam.length)];
            return `Kodam ${name} adalah: ${hasil}`;
        }

        return "Fitur tidak ditemukan";
    } catch (err) {
        console.error('Error:', err.message);
        return "Terjadi kesalahan.";
    }
}
export default async function cekms({ remoteJid, sock, text, msg }) {
    const cek_ms = cek.find(p => text.startsWith(p));
    try {
        const name = text.replace(cek_ms, '').trim();
        if (!name) return await sock.sendMessage(remoteJid, { text: `Masukkan namamu! Contoh: ${cek_ms} budi` });
        const result = handle_cek(cek_ms, name);
        await sock.sendMessage(remoteJid, { text: result }, { quoted: msg });
    } catch (err) {
        console.error(err);
        await sock.sendMessage(remoteJid, { text: "Maaf fitur tidak tersedia" });
    }
}