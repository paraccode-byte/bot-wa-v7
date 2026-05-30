import search_Anime from "./search.js";

export default async function carianime({remoteJid, sock, text, msg}) {
    try {
        const isiTeks = text.replace('.carianime', '').trim();
        if (!isiTeks) return await sock.sendMessage(remoteJid, { text: "Contoh: .carianime solo leveling" });
        const data = await search_Anime(isiTeks);
        if (!data) return await sock.sendMessage(remoteJid, { text: "Anime tidak ditemukan." });
        const format = `*ANIME INFORMATION* 🎬\n\n` +
            `*🇯🇵 Judul:* ${data.title}\n` +
            `*🇺🇸 English:* ${data.english}\n` +
            `*⭐ Score:* ${data.score}\n` +
            `*📊 Status:* ${data.status}\n` +
            `*🏷️ Genre:* ${data.genres.join(', ')}\n\n` +
            `*📖 Sinopsis:*\n_${data.description}_\n\n` +
            `*📺 Streaming Resmi:*\n${data.link}\n\n` +
            `*🔔 Info:* ${data.nextepi ? 'Eps ' + data.nextepi + ' akan tayang.' : 'Sudah Tamat.'}`;

        await sock.sendMessage(remoteJid, {
            image: { url: data.poster },
            caption: format
        }, { quoted: msg });

    } catch (err) {
        console.error(err);
        await sock.sendMessage(remoteJid, { text: 'Terjadi kesalahan sistem.' });
    }
}