import fs from "fs";

export default async function ceklink({ remoteJid, grupIndex, text, msg, sock, sender }) {
    if (!remoteJid.endsWith('@g.us') || msg.key.fromMe) return;
    const groupMetadata = await sock.groupMetadata(remoteJid);
    const participant = groupMetadata.participants.find(p => p.phoneNumber === sender);
    const isAdmin = participant?.admin === 'admin' || participant?.admin === 'superadmin';
    if (isAdmin) return;
    const condition = JSON.parse(fs.readFileSync('./database/filter_msg.json', 'utf-8'));
    if (!condition.nolink) return;
    const limit_nolink = JSON.parse(fs.readFileSync('./database/limit_voul.json', "utf-8"));
    try {
        if (text.includes('https://')) {
            if (!limit_nolink.nolink[sender]) {
                limit_nolink.nolink[sender] = 1;
            }
            if (limit_nolink.nolink[sender] < 3) {
                await sock.sendMessage(remoteJid, { delete: msg.key });
                await sock.sendMessage(remoteJid, {
                    text: `⚠️ Pesan dihapus karena mengandung link.\n\nPeringatan ke: ${limit_nolink.nolink[sender]} / 3\nJika sudah 3 kali, Anda akan dikeluarkan otomatis.`
                });
                limit_nolink.nolink[sender] += 1;
                fs.writeFileSync('./database/limit_voul.json', JSON.stringify(limit_nolink));
            } else if (limit_nolink.nolink[sender] >= 3) {
                await sock.sendMessage(remoteJid, { delete: msg.key });
                await sock.sendMessage(remoteJid, {
                    text: `❌ Anggota @${sender.split('@')[0]} dikeluarkan karena telah melanggar batas (3/3).`,
                    mentions: [sender]
                });
                await sock.groupParticipantsUpdate(remoteJid, [sender], "remove");
                limit_nolink.nolink[sender] = 0
                fs.writeFileSync('./database/limit_voul.json', JSON.stringify(limit_nolink));
            }
        }
    } catch (err) {
        console.error(err);
    }
}
