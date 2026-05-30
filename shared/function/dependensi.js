import makeWASocket, { useMultiFileAuthState, DisconnectReason, downloadMediaMessage, downloadContentFromMessage, getContentType, fetchLatestBaileysVersion } from 'baileys';
import { Boom } from '@hapi/boom';
import qrcode from 'qrcode-terminal';
import promptSync from 'prompt-sync';
import pino from 'pino';
import 'module-alias/register';

export { 
    makeWASocket, useMultiFileAuthState, DisconnectReason, 
    downloadContentFromMessage, downloadMediaMessage, getContentType,
    Boom, qrcode, pino, promptSync, fetchLatestBaileysVersion
 }
