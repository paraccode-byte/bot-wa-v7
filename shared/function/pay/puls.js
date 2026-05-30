import { pulsa } from "../menu_array.js";
import fs from "fs";

export default async function puls_ms({ remoteJid, sock, sender, user_name, msg, text }) {
    const puls_ms = pulsa.find(p => p.msg === text);
    try {
        await sock.sendMessage(remoteJid, {
            text: `Halo @${sender.split('@')[0]}, permintaan top up pulsa kamu sudah diteruskan ke Admin. Silahkan cek chat pribadi.`,
            mentions: [sender]
        }, { quoted: msg });
        await sock.sendMessage(sender, {
            text: `Halo ${user_name}, permintaan top up *${puls_ms.puls}* kamu sedang diproses oleh Admin. Tunggu sebentar ya.`
        });
        const adminNumber = fs.readFileSync('./database/own.txt', 'utf-8') || '62895322357910@s.whatsapp.net';
        const infoUntukAdmin = `*NOTIFIKASI TOP UP*\n\n` +
            `👤 Nama: ${user_name}\n` +
            `📱 Nomor: ${sender.split('@')[0]}\n` +
            `💬 Pesan: Ingin melakukan top up pulsa ${puls_ms.puls}.\n\n` +
            `Silahkan hubungi user tersebut atau klik link ini:\n` +
            `wa.me/${sender.split('@')[0]}`;
        await sock.sendMessage(adminNumber, { text: infoUntukAdmin });
    } catch (err) {
        console.error(err);
        await sock.sendMessage(remoteJid, { text: 'Terjadi kesalahan sistem saat mengirim pesan.' });
    }
}