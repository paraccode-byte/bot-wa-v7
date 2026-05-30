export default async function tagall({sock, remoteJid, msg}) {
    try {
        const groupMetadata = await sock.groupMetadata(remoteJid);
        const participants = groupMetadata.participants;
        let teksTag = `*📢 TAG ALL MEMBERS*\n\n`;
        const membersJid = [];
        participants.forEach((mem, i) => {
            teksTag += `${i + 1}. @${mem.id.split('@')[0]}\n`;
            membersJid.push(mem.id);
        });
        teksTag += `\n*Total:* ${participants.length} Anggota`;
        await sock.sendMessage(remoteJid, {
            text: teksTag,
            mentions: membersJid
        }, { quoted: msg });
    } catch (err) {
        console.error('Gagal tag all:', err.message);
        await sock.sendMessage(remoteJid, { text: 'Maaf, menu groub sedang tidak tersedia.' });
    }
}