export default async function view({m, sock, remoteJid, msg, downloadMediaMessage}) {
    try {
        const msg_once = await m.messages[0]?.message?.extendedTextMessage?.contextInfo?.quotedMessage?.imageMessage;
        if (!msg_once) return sock.sendMessage(remoteJid, { text: "Balas pesan sekali lihat dengan .view " })
        const buffer = await downloadMediaMessage(
            { message: { imageMessage: msg_once } },
            'buffer',
            {},
            {
                reuploadRequest: sock.updateMediaMessage
            }
        )
        await sock.sendMessage(remoteJid, { image: buffer, caption: 'Gambar berhasil di ambil!' }, { quoted: msg })
    } catch (error) {
        console.error(error)
        await sock.sendMessage(remoteJid, { text: 'Gambar Gagal di ambil!' }, { quoted: msg })
    }
}