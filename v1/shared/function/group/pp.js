export default async function pp({sock, remoteJid, msg}) {
    try {
        const pp = await sock.profilePictureUrl(remoteJid, 'image')
        await sock.sendMessage(remoteJid, {
            image: { url: pp },
            caption: 'Ini foto profil grupnya!'
        }, { quoted: msg });
    } catch (err) {
        console.error('Gagal membaca info grub:', err.message);
        await sock.sendMessage(remoteJid, { text: 'Maaf, menu groub sedang tidak tersedia.' });
    }
}