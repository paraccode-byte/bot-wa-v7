import fs from 'fs';
import Ffmpeg from 'fluent-ffmpeg';
import { Sticker, StickerTypes } from 'wa-sticker-formatter'

export default async function vid2stiker({remoteJid, sock, msgType, msg, downloadMediaMessage}) {
    try {
        const isVideo = msgType === 'videoMessage';
        const isQuotedVideo = msgType === 'extendedTextMessage' && msg.message.extendedTextMessage.contextInfo?.quotedMessage?.videoMessage;
        if (!isVideo && !isQuotedVideo) {
            return await sock.sendMessage(remoteJid, { text: '❌ Balas atau kirim video dengan caption .vid2stiker' });
        }
        const messageToDownload = isQuotedVideo ? {
            message: msg.message.extendedTextMessage.contextInfo.quotedMessage
        } : msg;
        const buffer = await downloadMediaMessage(messageToDownload, 'buffer', {}, { reuploadRequest: sock.updateMediaMessage });
        const fileName = `./temp_${Date.now()}`;
        const inputPath = `${fileName}.mp4`;
        const outputPath = `${fileName}.webp`;
        fs.writeFileSync(inputPath, buffer);
        Ffmpeg(inputPath)
            .setStartTime('00:00:00')
            .setDuration(3)
            .outputOptions([
                "-vcodec", "libwebp",
                "-vf", "scale='min(512,iw)': 'min(512,ih)':force_original_aspect_ratio=decrease,fps=15, pad=512:512:(512-iw)/2:(512-ih)/2:color=0x00000000",
                "-lossless", "0",
                "-compression_level", "6",
                "-q:v", "30",
                "-loop", "0",
                "-preset", "picture",
                "-an",
                "-vsync", "0"
            ])
            .on('end', async () => {
                const sticker = new Sticker(fs.readFileSync(outputPath), {
                    pack: 'My Bot',
                    author: 'Paras',
                    type: StickerTypes.FULL,
                    quality: 50
                });
                const result = await sticker.toBuffer();
                await sock.sendMessage(remoteJid, { sticker: result }, { quoted: msg });
                if (fs.existsSync(inputPath)) fs.unlinkSync(inputPath);
                if (fs.existsSync(outputPath)) fs.unlinkSync(outputPath);
            })
            .on('error', async (err) => {
                console.error("FFmpeg Error:", err);
                await sock.sendMessage(remoteJid, { text: '❌ Gagal memproses video.' });
                if (fs.existsSync(inputPath)) fs.unlinkSync(inputPath);
            })
            .save(outputPath)

    } catch (err) {
        console.error("Sistem Error:", err);
        await sock.sendMessage(remoteJid, { text: '❌ Terjadi kesalahan internal.' });
    }
}