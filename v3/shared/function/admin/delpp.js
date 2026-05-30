export default async function delpp({remoteJid, sock, msg}) {
    try {
        await sock.removeProfilePicture(remoteJid)
        await sock.sendMessage(remoteJid, {
            text: 'Profile picture grup berhasil di hapus ✅'
        }, { quoted: msg })
    } catch (error) {
        console.error(error)
    }
}