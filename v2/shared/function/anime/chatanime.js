import dotenv from "dotenv";
import { GoogleGenAI } from "@google/genai";
import { char } from "../menu_array.js";
dotenv.config();

async function anime_chat(chat, char) {
    const ai = new GoogleGenAI({
        apiKey: process.env.GEMINI_API_KEY
    });
    const prompt = `(nama mu adalah ${char}), ${chat}`
    const res = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: prompt
    });
    return res.text;
}

export default async function chatanime({ remoteJid, sock, text,  msg }) {
    const anim_ms = char.find(c => text.startsWith(c));
    try {
        const isiTeks = text.replace(anim_ms, '').trim();
        if (!isiTeks) return await sock.sendMessage(remoteJid, { text: "Tanyakan sesuatu! contoh: .noa apa itu ikan" });
        const answer = await anime_chat(isiTeks, anim_ms.replace('.', ''));
        await sock.sendMessage(remoteJid, { text: answer }, { quoted: msg })
    } catch (err) {
        console.error(err);
        await sock.sendMessage(remoteJid, { text: 'Kena limit bro! tunggu 30 detik baru coba lagi' });
    }
}