import sharp from "sharp";

export default async function setpp({ remoteJid, sock, downloadMediaMessage, msgType, msg }) {
    try {
        const isImage = msgType === 'imageMessage';
        const isQuotedImage = msgType === 'extendedTextMessage' && msg.message.extendedTextMessage.contextInfo?.quotedMessage?.imageMessage;
        if (!isImage && !isQuotedImage) {
            return await sock.sendMessage(remoteJid, { text: 'Kirim gambar ukuran 1 : 1 (kotak) dengan caption .setppgroup atau balas gambar dengan .setppgroup' });
        }
        const messageToDownload = isQuotedImage ? {
            message: msg.message.extendedTextMessage.contextInfo.quotedMessage
        } : msg;
        const buffer = await downloadMediaMessage(
            messageToDownload,
            'buffer',
            {},
            {
                reuploadRequest: sock.updateMediaMessage
            }
        );
        const pp = await sharp(buffer)
            .resize(512, 512, {
                fit: 'contain',
                background: { r: 0, g: 0, b: 0, alpha: 0 }
            })
            .webp()
            .toBuffer();
        await sock.updateProfilePicture(remoteJid, pp)
        await sock.sendMessage(remoteJid, {
            text: 'Profile picture grup berhasil di ubah ✅'
        }, { quoted: msg })
    } catch (error) {
        console.error(error)
        await sock.sendMessage(remoteJid, {
            text: 'Profile picture grup gagal di ubah, periksa kembali ukuran gambar, harus ukuran 1 : 1 (kotak) dan periksa nomor bot apakah sudah di jadikan admin?'
        }, { quoted: msg })
    }
}