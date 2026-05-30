import fs from "fs";

export default async function nolink({ remoteJid, sock, text, msg, fullCommand, args, grupIndex, isGroup }) {
    if (!remoteJid.endsWith('@g.us')) return ;
    const command = text.replace('.nolink', '').trim();
    try {
        if (!command && command !== 'on' && command !== 'off') return await sock.sendMessage(remoteJid, { text: 'Format salah! contoh:\n.nolink on\n.nolink off' });
        const rawdata = JSON.parse(fs.readFileSync('./database/filter_msg.json', "utf-8"));
        if (command === 'on') {
            rawdata.nolink = true
            fs.writeFileSync('./database/filter_msg.json', JSON.stringify(rawdata));
            return await sock.sendMessage(remoteJid, { text: "Pengaturan no link telah di ubah menjadi on ✅" })
        }
        else if (command === 'off') {
            rawdata.nolink = false
            fs.writeFileSync('./database/filter_msg.json', JSON.stringify(rawdata));
            return await sock.sendMessage(remoteJid, { text: "Pengaturan no link telah di ubah menjadi off ✅" })
        }
    } catch (err) {
        console.error(err)
        return await sock.sendMessage(remoteJid, { text: "Terjadi kesalahan server" })
    }
}
