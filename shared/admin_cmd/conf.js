import fs from "fs";
import upload_file from "./uploadfile.js";

export default async function conf({ remoteJid, sock, text, msg, msgType, downloadMediaMessage }) {
    const name = text.replace('.conf', '').trim();
    if (!name) return sock.sendMessage(remoteJid, { text: 'ketik nama! contoh: .conf bot rucas' });
    try {
        const isImage = msgType === 'imageMessage';
        const isQuotedImage = msgType === 'extendedTextMessage' && msg.message.extendedTextMessage.contextInfo?.quotedMessage?.imageMessage;
        if (!isImage && !isQuotedImage) {
            return await sock.sendMessage(remoteJid, { text: 'Kirim gambar!' });
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
        const image = await upload_file(buffer);
        const newdata = {
            image: image.download_url,
            name: name
        };
        const now = new Date();
        const option = {
            timeZone: 'Asia/Jakarta',
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            timeZoneName: 'short'
        };
        fs.writeFileSync('./database/person_data.json', JSON.stringify(newdata));
        const time = now.toLocaleString('id-ID', option);
        const format =
            `----- DATA UPLOADED -----\n` +
            `Name bot: ${newdata.name}\n` +
            `Time: ${time}\n` +
            `Url Image:\n\n` +
            `${image.download_url}\n\n` +
            `Data changed successfully ✅`;

        await sock.sendMessage(remoteJid, {
            image: { url: image.download_url },
            caption: format
        }, { quoted: msg });
    } catch (err) {
        await sock.sendMessage(remoteJid, { text: 'Terjadi kesalahan sistem saat menambah data. ❌' }, { quoted: msg });
        console.error(err);
    }
} 