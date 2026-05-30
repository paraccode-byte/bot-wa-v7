import toxic_word from "./toxic-data.json" with { type: "json" };
import fs from "fs";

export default async function ceklink({ remoteJid, grupIndex, text, msg, sock, sender }) {
    if (!remoteJid.endsWith('@g.us') || !toxic_word.some(w => text.toLowerCase().includes(w)) || msg.key.fromMe) return;
    const groupMetadata = await sock.groupMetadata(remoteJid);
    const participant = groupMetadata.participants.find(p => p.phoneNumber === sender);
    const isAdmin = participant?.admin === 'admin' || participant?.admin === 'superadmin';
    if (isAdmin) return;
    const condition = JSON.parse(fs.readFileSync('./database/filter_msg.json', 'utf-8'));
    if (!condition.notoxic) return;
    const limit_notoxic = JSON.parse(fs.readFileSync('./database/limit_voul.json', "utf-8"));
    try {
        if (!limit_notoxic.notoxic[sender]) {
            limit_notoxic.notoxic[sender] = 1;
        }
        if (limit_notoxic.notoxic[sender] < 3) {
            await sock.sendMessage(remoteJid, { delete: msg.key });
            await sock.sendMessage(remoteJid, {
                text: `⚠️ Pesan dihapus karena mengandung kata toxic.\n\nPeringatan ke: ${limit_notoxic.notoxic[sender]} / 3\nJika sudah 3 kali, Anda akan dikeluarkan otomatis.`
            });
            limit_notoxic.notoxic[sender] += 1;
            fs.writeFileSync('./database/limit_voul.json', JSON.stringify(limit_notoxic));
        } else if (limit_notoxic.notoxic[sender] >= 3) {
            await sock.sendMessage(remoteJid, { delete: msg.key });
            await sock.sendMessage(remoteJid, {
                text: `❌ Anggota @${sender.split('@')[0]} dikeluarkan karena telah melanggar batas kata toxic (3/3).`,
                mentions: [sender]
            });
            await sock.groupParticipantsUpdate(remoteJid, [sender], "remove");
            limit_notoxic.notoxic[sender] = 0
            fs.writeFileSync('./database/limit_voul.json', JSON.stringify(limit_notoxic));
        }
    } catch (err) {
        console.error(err);
    }
}
