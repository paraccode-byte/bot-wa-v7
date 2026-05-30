export default async function kick({ remoteJid, sock, msg }) {
    try {
        const targets = msg.message.extendedTextMessage?.contextInfo?.mentionedJid;
        if (targets && targets.length > 0) {
            const target = targets[0];
            await sock.groupParticipantsUpdate(remoteJid, [target], 'remove');
            await sock.sendMessage(remoteJid, { text: `Berhasil mengeluarkan @${target.split('@')[0]}`, mentions: [target] });
        } else {
            await sock.sendMessage(remoteJid, { text: "Silakan tag orang yang ingin di-kick!" }, { quoted: msg });
        }
    } catch (error) {
        console.error(error)
        await sock.sendMessage(remoteJid, { text: "Gagal mengeluarkan anggota. Pastikan bot adalah admin!" }, { quoted: msg });
    }
}