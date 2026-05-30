import fs from "fs";
const messageHistory = {};

export default async function cekspam({ remoteJid, grupIndex, msg, sock, sender }) {
    if (!remoteJid.endsWith('@g.us') || msg.key.fromMe) return;
    const groupMetadata = await sock.groupMetadata(remoteJid);
    const participant = groupMetadata.participants.find(p => p.phoneNumber === sender);
    const isAdmin = participant?.admin === 'admin' || participant?.admin === 'superadmin';
    if (isAdmin) return;
    const now = Date.now();
    try {
        if (!messageHistory[sender]) messageHistory[sender] = [];
        messageHistory[sender].push(now);
        messageHistory[sender] = messageHistory[sender].filter(timestamp => now - timestamp < 10000);
        if (messageHistory[sender].length < 4) return;
        console.log('terdeteksi spam')
        const condition = JSON.parse(fs.readFileSync('./database/filter_msg.json', 'utf-8'));
        if (!condition.nospam) return;
        const limit_nospam = JSON.parse(fs.readFileSync('./database/limit_voul.json', "utf-8"));
        if (!limit_nospam.nospam[sender]) {
            limit_nospam.nospam[sender] = 1;
        }
        if (limit_nospam.nospam[sender] < 3) {
            await sock.sendMessage(remoteJid, { delete: msg.key });
            await sock.sendMessage(remoteJid, {
                text: `⚠️ Pesan dihapus karena spam.\n\nPeringatan ke: ${limit_nospam.nospam[sender]} / 3\nJika sudah 3 kali, Anda akan dikeluarkan otomatis.`
            });
            limit_nospam.nospam[sender] += 1;
            fs.writeFileSync('./database/limit_voul.json', JSON.stringify(limit_nospam));
        } else if (limit_nospam.nospam[sender] >= 3) {
            await sock.sendMessage(remoteJid, { delete: msg.key });
            await sock.sendMessage(remoteJid, {
                text: `❌ Anggota @${sender.split('@')[0]} dikeluarkan karena telah melanggar batas spam (3/3).`,
                mentions: [sender]
            });
            await sock.groupParticipantsUpdate(remoteJid, [sender], "remove");
            limit_nospam.nospam[sender] = 0
            fs.writeFileSync('./database/limit_voul.json', JSON.stringify(limit_nospam));
        }
        messageHistory[sender] = [];
    } catch (err) {
        console.error(err);
    }
}