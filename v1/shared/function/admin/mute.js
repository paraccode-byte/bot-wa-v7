export default async function mute({remoteJid, sock, text, msg}) {
    const on_of = text.replace('.mute', '').trim().toLowerCase();
    try {
        if (on_of !== 'on' && on_of !== 'off') return await sock.sendMessage(remoteJid, {
            text: 'Format salah! contoh .mute on'
        }, { quoted: msg })
        if (on_of === 'on') {
            await sock.groupSettingUpdate(remoteJid, 'announcement');
            await sock.sendMessage(remoteJid, {
                text: `Pengaturan mute telah di ubah menjadi ${on_of}.`
            })
        } else {
            await sock.groupSettingUpdate(remoteJid, 'not_announcement');
            await sock.sendMessage(remoteJid, {
                text: `Pengaturan mute telah di ubah menjadi ${on_of}.`
            })
        }
    } catch (error) {
        console.error("Gagal mengubah izin grup:", error);
        await sock.sendMessage(remoteJid, { text: 'Gagal mengubah pengaturan. Pastikan bot adalah Admin!' });
    }
}