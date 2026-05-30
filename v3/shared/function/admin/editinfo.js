export default async function editinfo({ text, remoteJid, sock, msg }) {
    try {
        if (text.startsWith('.setdescgrpup')) {
            const desc = text.replace('.setdescgrpup', '').trim();
            if (!desc) {
                return await sock.sendMessage(remoteJid, {
                    text: 'Ketik isi deskripsi yang di ingin kan! contoh: .setdescgrpup jangan toxic ya guys'
                }, { quoted: msg })
            }
            await sock.groupUpdateDescription(remoteJid, desc);
            await sock.sendMessage(remoteJid, {
                text: 'Descripsi / info grup berhasil di ubah ✅'
            }, { quoted: msg })
        }
        if (text.startsWith('.editinfo')) {
            const info = text.replace('.editinfo', '').trim();
            if (!info) {
                return await sock.sendMessage(remoteJid, {
                    text: 'Ketik isi info yang di ingin kan! contoh: .editinfo jangan toxic ya guys'
                }, { quoted: msg })
            }
            await sock.groupUpdateDescription(remoteJid, info);
            await sock.sendMessage(remoteJid, {
                text: 'Descripsi / info grup berhasil di ubah ✅'
            }, { quoted: msg })
        }

    } catch (error) {
        console.error(error)
    }
}