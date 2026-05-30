import sharp from "sharp";

export default async function stikerpp({remoteJid, sock, msg}) {
    try {
        const url = await sock.profilePictureUrl(remoteJid, "image");
        const res = await fetch(url);
        const arr_buffer = await res.arrayBuffer();
        const buffer = Buffer.from(arr_buffer);
        const image = await sharp(buffer)
            .resize(512, 512, {
                fit: 'contain',
                background: { r: 0, g: 0, b: 0, alpha: 0 }
            })
            .webp()
            .toBuffer();

        await sock.sendMessage(remoteJid, {
            sticker: image,
            mimetype: 'image/webp'
        }, { quoted: msg }
        )
    } catch (err) {
        console.error(err);
        await sock.sendMessage(remoteJid, { text: 'Gagal memuat stiker.' });
    }
}