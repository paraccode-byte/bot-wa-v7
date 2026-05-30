export default async function setname({remoteJid, sock, text, msg}) {
    try {
        const nama = text.replace('.setnamegroup', '');
        if (!nama) return await sock.sendMessage(remoteJid, {
            text: 'Ketik nama grup yang di ingin kan! contoh: .setnamegroup JB oki store'
        })
        await sock.groupUpdateSubject(remoteJid, nama);
        await sock.sendMessage(remoteJid, {
            text: 'Nama grup berhasil di ubah ✅'
        }, { quoted: msg })
    } catch (error) {
        console.error(error)
    }
}