export default async function name_desc({text, sock, remoteJid, msg}) {
    try {
        const metadata = await sock.groupMetadata(remoteJid);
        const teks = text === '.namegc' ? metadata.subject : metadata.desc?.toString() || "Tidak ada deskripsi.";
        await sock.sendMessage(remoteJid, { text: teks }, { quoted: msg });
    } catch (err) {
        console.error('Gagal membaca info grub:', err.message);
        await sock.sendMessage(remoteJid, { text: 'Maaf, menu groub sedang tidak tersedia.' });
    }
}