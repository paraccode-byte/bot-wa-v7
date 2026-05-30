export default async function linkgc({sock, remoteJid, msg}) {
    try {
        const link = await sock.groupInviteCode(remoteJid);
        await sock.sendMessage(remoteJid, { text: `🔗link grup: https://chat.whatsapp.com/${link}` }, { quoted: msg });
    } catch (err) {
        console.error('Gagal membaca file:', err.message);
        await sock.sendMessage(remoteJid, { text: 'Maaf, menu groub sedang tidak tersedia.' });
    }
}