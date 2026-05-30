export default async function polling({text, remoteJid, sock, msg}) {
    try {
        const isiTeks = text.replace('.makepolling', '').trim();
        if (!isiTeks) {
            return await sock.sendMessage(remoteJid, {
                text: "❌ Format salah!\nContoh: *.makepolling Warna | merah/biru/hijau*"
            });
        }
        const [judul, opsi] = isiTeks.split('|');
        if (!judul || !opsi) {
            return await sock.sendMessage(remoteJid, {
                text: "❌ Gunakan tanda | untuk memisahkan judul dan pilihan.\nContoh: *.makepolling Nama Buah | Apel/Jeruk*"
            });
        }
        const values = opsi.split('/').map(v => v.trim()).filter(v => v !== '');
        if (values.length < 2) {
            return await sock.sendMessage(remoteJid, { text: "❌ Berikan minimal 2 pilihan jawaban!" });
        }
        await sock.sendMessage(remoteJid, {
            poll: {
                name: judul.trim(),
                values: values,
                selectableCount: 1,
            }
        }, { quoted: msg });
    } catch (err) {
        console.error('Gagal membuat polling:', err.message);
        await sock.sendMessage(remoteJid, { text: 'Maaf, polling sedang tidak tersedia.' });
    }
}