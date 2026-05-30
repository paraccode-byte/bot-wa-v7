import sharp from "sharp";

export default async function img2stiker({remoteJid, sock, msgType, downloadMediaMessage, msg}) {
    try {
        const isImage = msgType === 'imageMessage';
        const isQuotedImage = msgType === 'extendedTextMessage' && msg.message.extendedTextMessage.contextInfo?.quotedMessage?.imageMessage;
        if (!isImage && !isQuotedImage) {
            return await sock.sendMessage(remoteJid, { text: 'Kirim gambar dengan caption .img2stiker atau balas gambar dengan .img2stiker' });
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
        const stickerBuffer = await sharp(buffer)
            .resize(512, 512, {
                fit: 'contain',
                background: { r: 0, g: 0, b: 0, alpha: 0 }
            })
            .webp()
            .toBuffer();
        await sock.sendMessage(remoteJid, {
            sticker: stickerBuffer,
            mimetype: 'image/webp'
        }, { quoted: msg });

    } catch (err) {
        console.error("Error Detail:", err);
        await sock.sendMessage(remoteJid, { text: 'Gagal memproses gambar menjadi stiker.' });
    }
} 