import nolink from "./admin/nolink.js";
import mute from "./admin/mute.js";
import { setwelcome, setleave } from "./admin/set_.js";
import notoxic from "./admin/notoxic.js";
import nospam from "./admin/nospam.js";
import setpp from "./admin/setpp.js";
import setname from "./admin/setname.js";
import editinfo from "./admin/editinfo.js";
import delpp from "./admin/delpp.js";
import add from "./admin/add.js";
import kick from "./admin/kisck.js";
import createadmin from "./admin/createadmin.js";
import cabutadmin from "./admin/cabutadmin.js";

export default async function admin({ remoteJid, sock, text, sender, msg, no_link_json, msgType, downloadMediaMessage }) {
    const groupMetadata = await sock.groupMetadata(remoteJid);
    const participant = groupMetadata.participants.find(p => p.phoneNumber === sender);
    const isAdmin = participant?.admin === 'admin' || participant?.admin === 'superadmin';
    if (!isAdmin) return;
    const args = text.trim().split(" ");
    const fullCommand = args[0].toLowerCase();

    const params = {
        remoteJid: remoteJid,
        sock: sock,
        text: text,
        msg: msg,
        fullCommand: fullCommand,
        no_link_json: no_link_json,
        args: args,
        msgType: msgType,
        downloadMediaMessage: downloadMediaMessage
    }

    const admin_data = [
        { command: ".mute", function: mute },
        { command: ".nolink", function: nolink },
        { command: ".nolinkgc", function: nolink },
        { command: ".nolinkch", function: nolink },
        { command: ".nolinktiktok", function: nolink },
        { command: ".nolinkfb", function: nolink },
        { command: ".nolinktwitter", function: nolink },
        { command: ".nolinkig", function: nolink },
        { command: ".nolinktg", function: nolink },
        { command: ".nolinkdc", function: nolink },
        { command: ".nolinkytvid", function: nolink },
        { command: ".nolinkytch", function: nolink },
        { command: ".nolinksosmed", function: nolink },
        { command: ".setwelcome", function: setwelcome },
        { command: ".setleave", function: setleave },
        { command: ".notoxic", function: notoxic },
        { command: ".nospam", function: nospam },
        { command: ".setppgroup", function: setpp },
        { command: ".delppgroup", function: delpp },
        { command: ".setnamegroup", function: setname },
        { command: ".setdescgrpup", function: editinfo },
        { command: ".editinfo", function: editinfo },
        { command: ".add", function: add },
        { command: ".kick", function: kick },
        { command: ".createadmin", function: createadmin },
        { command: ".cabutadmin", function: cabutadmin },
    ]
    for (const d of admin_data) {
        if (text.startsWith(d.command)) {
            const f = d.function || null;
            if (f) f(params);
        }
    }
}