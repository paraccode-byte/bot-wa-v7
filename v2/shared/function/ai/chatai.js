import dotenv from "dotenv";
import { GoogleGenAI } from "@google/genai";

dotenv.config();

async function gemini(prompt) {
  const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY
  });

  const res = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: prompt
  });

  return res.text;
}


export default async function chatai({remoteJid, sock, text, msg}) {
    try {
        const isiTeks = text.replace('.chatai', '').trim();
        if (!isiTeks) return await sock.sendMessage(remoteJid, { text: "Tanyakan sesuatu! contoh: .chatai apa itu amba" });
        const answer = await gemini(isiTeks);
        await sock.sendMessage(remoteJid, { text: answer }, { quoted: msg })
    } catch (err) {
        console.error(err);
        await sock.sendMessage(remoteJid, { text: 'Kena limit bro! tunggu 30 detik baru coba lagi' });
    }
}