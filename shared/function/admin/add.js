export default async function add({remoteJid, sock, text, msg}) {
    try {
        const nomor = text.replace('.add', '').trim().toLocaleLowerCase();
        if (!nomor || !(/^08\d{8,11}$/.test(nomor))) return await sock.sendMessage(remoteJid, {
            text: 'Ketik nomor yang ingin di masukan! contoh: .add 0812399999'
        }, { quoted: msg })
        const format_nomor = [`${nomor.replace('0', '62')}@s.whatsapp.net`]
        await sock.groupParticipantsUpdate(remoteJid, format_nomor, "add");
        await sock.sendMessage(remoteJid, {
            text: 'Anggota baru berhasil di tambahkan ✅'
        }, { quoted: msg })
    } catch (error) {
        console.error(error)
    }
}