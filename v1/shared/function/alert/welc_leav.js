import crypto from "crypto";
import fs from "fs";

export default async function welc_leav({ jid, update, sock}, alert) {
    const participant = update.participants;
    const res = JSON.parse(fs.readFileSync(`./database/${alert}.json`, 'utf-8'));
    if(!res || Object.keys(res).length === 0) return;
    const { caption, url, type } = res;
    for (const user of participant) {
        const tag = user.id || user.phoneNumber;
        const format = caption.replaceAll('@', `@${tag.split('@')[0]}`);
        if (type === 'plan') {
            await sock.sendMessage(jid, {
                text: format,
                mentions: [tag]
            })
        } else if (type === 'image') {
            await sock.sendMessage(jid, {
                image: { url: url },
                caption: format,
                mimetype: 'image/jpeg',
                mentions: [tag]
            });
        } else if (type === 'video') {
            await sock.sendMessage(jid, {
                video: { url: url },
                caption: format,
                mimetype: 'video/mp4',
                fileName: `${crypto.randomUUID()}.mp4`,
                mentions: [tag]
            });
        }
    }
} 