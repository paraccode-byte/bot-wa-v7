export default async function member({sock, remoteJid, msg}) {
    try {
        const metadata = await sock.groupMetadata(remoteJid);
        const listPeserta = metadata.participants.map(peserta => peserta.id);
        const jumlahAnggota = listPeserta.length;
        let pesan = `Daftar Anggota Grup *${metadata.subject}*\n`;
        pesan += `Total Anggota: ${jumlahAnggota}\n\n`;

        listPeserta.forEach((jid, index) => {
            const nomor = jid.split('@')[0];
            pesan += `${index + 1}. @${nomor}\n`;
        });

        await sock.sendMessage(remoteJid, {
            text: pesan,
            mentions: listPeserta
        }, { quoted: msg });
    } catch (err) {
        console.error('Gagal membaca perintah', err.message);
        await sock.sendMessage(remoteJid, { text: 'Gagal mengambil data anggota grup.' });
    }
}