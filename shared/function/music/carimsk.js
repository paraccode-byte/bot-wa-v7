async function get_musik(judul) {
    try {
        const response = await fetch(`https://itunes.apple.com/search?term=${encodeURIComponent(judul)}&entity=song&limit=1`);
        const data = await response.json();
        if (data.resultCount > 0) {
            const lagu = data.results[0];
            return await lagu.previewUrl;
        } else {
            return null;
        }
    } catch (error) {
        console.error("Gagal memanggil API:", error);
    }
}

export default async function carimsk({remoteJid, sock, text, msg}) {
    try {
        const isiTeks = text.replace('.carimsk', '').trim();
        if (!isiTeks) return await sock.sendMessage(remoteJid, { text: "Ketik nama musik, contoh: .carimsk ghost" });
        const urlAudio = await get_musik(isiTeks)
        await sock.sendMessage(remoteJid, {
            audio: { url: urlAudio },
            mimetype: 'audio/mp4',
            ptt: false
        }, { quoted: msg });

    } catch (err) {
        console.error(err);
        await sock.sendMessage(remoteJid, { text: 'Terjadi kesalahan sistem saat mengirim audio.' });
    }
}