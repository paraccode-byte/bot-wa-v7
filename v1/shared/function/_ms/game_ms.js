import { game as listgame } from "../menu_array.js";

export default async function game({ remoteJid, sock, msg, text }) {
    const game_ms = listgame.find(p => p.game === text);
    if(!game_ms) return;
    try {
        const name_game = game_ms.game.replace('.', '').trim();
        await sock.sendMessage(remoteJid, {
            text: `Silahkan klik link di bawah ini untuk memainkan game *${name_game}*\n${game_ms.link}`,
        }, { quoted: msg });
    } catch (err) {
        console.error(err);
        await sock.sendMessage(remoteJid, { text: 'Terjadi kesalahan sistem saat mengirim pesan.' });
    }
}