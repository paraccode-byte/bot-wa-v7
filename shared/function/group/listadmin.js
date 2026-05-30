export default async function listadmin({sock, remoteJid, msg}) {
    try {
        const groupMetadata = await sock.groupMetadata(remoteJid);
        const participants = groupMetadata.participants;
        const admins = participants.filter(p => p.admin === 'admin' || p.admin === 'superadmin');
        let teks = `*DAFTAR ADMIN GRUP*\n\n`;
        const adminMentions = [];
        admins.forEach((admin, i) => {
            teks += `${i + 1}. @${admin.id.split('@')[0]}\n`;
            adminMentions.push(admin.id);
        });
        teks += `\nTotal: ${admins.length} Admin`;
        await sock.sendMessage(remoteJid, {
            text: teks,
            mentions: adminMentions
        }, { quoted: msg });

    } catch (err) {
        console.error('Gagal mengambil daftar admin:', err.message);
        await sock.sendMessage(remoteJid, { text: 'Terjadi kesalahan saat mengambil data admin.' });

    }
}