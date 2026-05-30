export default async function time({sock, remoteJid, msg, text}) {
    const region = text.replace('.time', '').trim();
    if (!['wit', 'wita', 'wib'].includes(region)) return await sock.sendMessage(remoteJid, { text: "isi region! contoh: .time wib" })
    const wi = { wib: 'Asia/Jakarta', wita: 'Asia/Makassar', wit: 'Asia/Jayapura' }
    try {
        const now = new Date();
        const waktuWIB = new Intl.DateTimeFormat("id-ID", {
            timeZone: wi[region],
            dateStyle: "full",
            timeStyle: "long"
        }).format(now);
        await sock.sendMessage(remoteJid, { text: waktuWIB }, { quoted: msg });
    } catch (err) {
        console.error('Gagal membaca waktu:', err.message);
        await sock.sendMessage(remoteJid, { text: 'Maaf, menu groub sedang tidak tersedia.' });
    }
}