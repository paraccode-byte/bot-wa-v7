import 'module-alias/register';
import { makeWASocket, useMultiFileAuthState, DisconnectReason, downloadMediaMessage, Boom, qrcode, pino } from 'my-shared/function/dependensi.js';
import readline from 'readline'; // Ditambahkan untuk input nomor HP di terminal

// HELPER FUNCTION
import welc_leav from 'my-shared/function/alert/welc_leav.js';
import mainData from './mainData.js';
import cektoxic from 'my-shared/function/filter_msg/notoxic.js';
import cekspam from 'my-shared/function/filter_msg/nospam.js';
import ceklink from 'my-shared/function/filter_msg/nolink.js';
import conf from 'my-shared/admin_cmd/conf.js';
import own from '../../shared/admin_cmd/own.js';

const question = (text) => {
    const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
    return new Promise((resolve) => rl.question(text, (answer) => { rl.close(); resolve(answer); }));
};

async function connectToWhatsApp() {
    const logger = pino({ level: 'silent' });
    const { state, saveCreds } = await useMultiFileAuthState('session');

    const sock = makeWASocket({
        auth: state,
        printQRInTerminal: false,
        logger: logger,
        defaultQueryTimeoutMs: undefined,
    });
    if (!sock.authState.creds.registered) {
        setTimeout(async () => {
            let phoneNumber = await question('Masukkan nomor WhatsApp Bot (contoh: +62 821-xxxx-xxx): ');
            phoneNumber = phoneNumber.replace(/\D/g, "");

            if (!phoneNumber) {
                console.log('Nomor telepon tidak valid! Silakan restart bot.');
                process.exit(0);
            }

            try {
                const code = await sock.requestPairingCode(phoneNumber);
                console.log(`\n======================================`);
                console.log(`KODE PAIRING ANDA: ${code?.match(/.{1,4}/g)?.join('-') || code}`);
                console.log(`======================================\n`);
            } catch (error) {
                console.error('Gagal mendapatkan kode pairing:', error);
            }
        }, 3000);
    }

    sock.ev.on('connection.update', (update) => {
        const { connection, lastDisconnect } = update;

        if (connection === 'close') {
            const shouldReconnect = (lastDisconnect.error instanceof Boom)?.output?.statusCode !== DisconnectReason.loggedOut;
            console.log('Koneksi terputus karena:', lastDisconnect.error, ', mencoba hubungkan kembali:', shouldReconnect);
            if (shouldReconnect) {
                connectToWhatsApp();
            }
        } else if (connection === 'open') {
            console.log('Bot sudah terhubung ke WhatsApp! ✅');
        }
    });

    sock.ev.on('creds.update', saveCreds);

    sock.ev.on('messages.upsert', async m => {
        const msg = m.messages[0];
        if (!msg.message || m.type !== 'notify') return;
        const msgType = Object.keys(msg?.message || {})[0];
        const remoteJid = msg.key.remoteJid;
        const remoteJidAlt = msg.key.remoteJidAlt;
        const isGroup = remoteJid.endsWith('@g.us');

        const text = msg.message?.conversation ||
            msg.message?.imageMessage?.caption ||
            msg.message?.videoMessage?.caption ||
            msg.message?.extendedTextMessage?.text ||
            "";

        if (remoteJid === '104105779396783@lid' || remoteJid === "62895322357910@s.whatsapp.net" || msg.key.fromMe) {
            const params = {
                m: m,
                remoteJid: remoteJid,
                sock: sock,
                text: text,
                msgType: msgType,
                msg: msg,
                downloadMediaMessage: downloadMediaMessage,
            }
            if (text.startsWith('.conf')) {
                console.log(`Memproses perintah: .conf`);
                await conf(params);
            }
            if (text.startsWith('.own')) {
                console.log(`Memproses perintah: .own`);
                await own(params);
            }

        }

        const user_name = msg.pushName;
        const sender = msg.key.participantAlt || msg.key.remoteJid;

        const allParams = {
            m: m,
            remoteJid: remoteJid,
            sock: sock,
            text: text,
            isGroup: isGroup,
            msgType: msgType,
            msg: msg,
            downloadMediaMessage: downloadMediaMessage,
            sender: sender,
            user_name: user_name,
        }
        await cektoxic(allParams);
        await cekspam(allParams);
        await ceklink(allParams);

        for (const d of mainData) {
            if (text.startsWith(d.command)) {
                console.log('In process..', d.command);
                const f = d.function || null;
                if (f) {
                    f(allParams);
                };
            }
        }
    });

    sock.ev.on('group-participants.update', async (update) => {
        const jid = update.id;
        const params = {
            jid: jid,
            sock: sock,
            update: update
        };
        const alert = {
            add: "welcome",
            remove: "leave"
        }
        if (update.action === 'add') {
            await welc_leav(params, alert[update.action]);
        }
        if (update.action === 'remove') {
            await welc_leav(params, alert[update.action])
        }
    });
}

connectToWhatsApp();