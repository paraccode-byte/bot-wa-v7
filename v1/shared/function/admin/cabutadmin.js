export default async function cabutadmin({text, remoteJid, sock, msg}) {
    try {
        const nomor = text.replace('.cabutadmin', '').trim().toLocaleLowerCase();
        if (!nomor || !(/^08\d{8,11}$/.test(nomor))) return await sock.sendMessage(remoteJid, {
            text: 'Ketik nomor yang ingin di cabut menjadi admin! contoh: .cabutadmin 0812399999'
        }, { quoted: msg })
        const format_nomor = [`${nomor.replace('0', '62')}@s.whatsapp.net`]
        await sock.groupParticipantsUpdate(remoteJid, format_nomor, "demote");
        await sock.sendMessage(remoteJid, {
            text: 'Admin berhasil di cabut ✅'
        }, { quoted: msg })
    } catch (error) {
        console.error(error)
    }
}