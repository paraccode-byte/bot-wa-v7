import add from "./add_data.js";
import upload_file from "./uploadfile.js";

export default async function add_data({ remoteJid, sock, text, msg, msgType, downloadMediaMessage }) {
    const data_array = text.split('|');
    const isImage = msgType === 'imageMessage';
    const isQuotedImage = msgType === 'extendedTextMessage' && msg.message.extendedTextMessage.contextInfo?.quotedMessage?.imageMessage;
    if (data_array.length < 3) {
        return await sock.sendMessage(remoteJid, {
            text: 'Format salah!'
        }, { quoted: msg });
    }
    if (!isImage && !isQuotedImage) {
        return await sock.sendMessage(remoteJid, { text: 'Kirim gambar!' });
    }
    try {
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
        const data = await upload_file(buffer);

        const name = data_array[1].trim();
        const idearly = data_array[2].trim();
        const isPerson = idearly.startsWith('+');
        const jid = isPerson ? idearly.replace(/\D/g, "") + '@s.whatsapp.net' : idearly;
        const url = data.download_url.trim();
        const id = await add(name, jid, url);
        const format =
            `----- DATA DI UPLOAD -----\n` +
            `Name group: ${name}\n` +
            `Jid group: ${jid}\n` +
            `Id database: ${id}\n` +
            `Name file image:\n${data.name}\n` +
            `Url image:\n${data.download_url}\n` +
            `Size image: ${data.size}\n` +
            `Page repo image: ${data.html_url}`

        await sock.sendMessage(remoteJid, {
            text: `Data berhasil ditambahkan! ✅`
        }, { quoted: msg });
        await sock.sendMessage(remoteJid, {
            image: { url: data.download_url },
            caption: format
        })
    } catch (error) {
        await sock.sendMessage(remoteJid, { text: 'Terjadi kesalahan sistem saat menambah data. ❌' }, { quoted: msg });
        console.error(error);
    }
}