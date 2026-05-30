import hdimage from './hd-img.js';

export default async function img2hd({msg, msgType, sock, downloadMediaMessage, remoteJid}) {
    try {
        const isImage = msgType === 'imageMessage';
        const isQuotedImage = msgType === 'extendedTextMessage' && msg.message.extendedTextMessage.contextInfo?.quotedMessage?.imageMessage;

        if (!isImage && !isQuotedImage) {
            return await sock.sendMessage(remoteJid, { text: 'Kirim gambar dengan caption .img2hd atau balas gambar dengan .img2hd' });
        }
        const messageToDownload = isQuotedImage ? {
            message: msg.message.extendedTextMessage.contextInfo.quotedMessage
        } : msg;
        const buffer = await downloadMediaMessage(
            messageToDownload,
            'buffer',
            {},
            {
                logger: console,
                reuploadRequest: sock.updateMediaMessage
            }
        );
        const img_hd_url = await hdimage(buffer);

        await sock.sendMessage(remoteJid, {
            image: { url: img_hd_url },
            caption: 'Ini hasil gambar HD kamu!',
            mimetype: 'image/jpeg'
        }, { quoted: msg });

    } catch (err) {
        console.error("Error Detail:", err);
        await sock.sendMessage(remoteJid, { text: 'Gagal memproses gambar menjadi hd.' });
    }
}