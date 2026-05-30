export default async function hidetag({sock, remoteJid, text, msg}) {
    try {
        const groupMetadata = await sock.groupMetadata(remoteJid);
        const participants = groupMetadata.participants;
        const members = participants.map(p => p.id);
        const pesanTambahan = text.split(' ').slice(1).join(' ');
        if(!pesanTambahan) return   await sock.sendMessage(remoteJid, { text: 'isi pesan! contoh: .hidetag halo guyss' });
        await sock.sendMessage(remoteJid, {
            text: pesanTambahan,
            mentions: members
        }, { quoted: msg });
    } catch (err) {
        console.error('Gagal tag anggota:', err.message);
        await sock.sendMessage(remoteJid, { text: 'Maaf, menu groub ini sedang tidak tersedia.' });
    }
}