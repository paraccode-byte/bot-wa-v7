export default async function createadmin({text, remoteJid, sock, msg}) {
    try {
        const nomor = text.replace('.createadmin', '').trim().toLocaleLowerCase();
        if (!nomor || !(/^08\d{8,11}$/.test(nomor))) return await sock.sendMessage(remoteJid, {
            text: 'Ketik nomor yang ingin di tambahkan menjadi admin! contoh: .createadmin 0812399999'
        }, { quoted: msg })
        const format_nomor = [`${nomor.replace('0', '62')}@s.whatsapp.net`]
        await sock.groupParticipantsUpdate(remoteJid, format_nomor, "promote");
        await sock.sendMessage(remoteJid, {
            text: 'Admin baru berhasil di tambahkan ✅'
        }, { quoted: msg })
    } catch (error) {
        console.error(error)
    }
}