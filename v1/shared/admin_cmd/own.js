import fs from "fs";

export default function own({ remoteJid, sock, text, msg }) {
    try {
        const rawNumber = text.replace('.own', '').trim();
        if (!rawNumber || !rawNumber.startsWith('+')) return sock.sendMessage(remoteJid, { text: 'ketik nomor! contoh: .own +62 858-6225-7470' });
        const formatNumber = rawNumber.replace(/\D/g, "");
        const number = `${formatNumber}@s.whatsapp.net`
        fs.writeFileSync('./database/own.txt', number);
        return sock.sendMessage(remoteJid, { text: `Nomor OWN berhasil di ubah✅\nNUMBER: ${rawNumber}` })
    } catch (err) {
        console.error(err)
        return sock.sendMessage(remoteJid, { text: 'gagl mengubah nomor OWN' })
    }
}