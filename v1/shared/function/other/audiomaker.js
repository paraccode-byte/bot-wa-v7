import { GoogleGenAI } from '@google/genai';
import 'dotenv/config';
import wav from 'wav';

async function createWavBuffer(pcmData, rate = 24000) {
   return new Promise((resolve, reject) => {
      const chunks = [];
      const writer = new wav.Writer({
         channels: 1,
         sampleRate: rate,
         bitDepth: 16,
      });

      writer.on('data', (chunk) => chunks.push(chunk));
      writer.on('end', () => resolve(Buffer.concat(chunks)));
      writer.on('error', reject);

      writer.write(pcmData);
      writer.end();
   });
}
async function audiomaker(teks) {
   const ai = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
   });

   const response = await ai.models.generateContent({
      model: "gemini-2.5-flash-preview-tts",
      contents: [{ parts: [{ text: teks }] }],
      config: {
         responseModalities: ['AUDIO'],
         speechConfig: {
            voiceConfig: {
               prebuiltVoiceConfig: { voiceName: 'Kore' },
            },
         },
      },
   });

   const data = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
   if (!data) return;
   const audioBuffer = Buffer.from(data, 'base64');
   const finalAudio = await createWavBuffer(audioBuffer);
   return finalAudio;
}

export default async function audiomake({remoteJid, sock, text, msg}) {
    try {
        const isiTeks = text.replace('.audiomaker', '').trim();
        if (!isiTeks) return await sock.sendMessage(remoteJid, { text: "Ketik sesuatu! contoh: .audiomaker halo guys" });

        const audioBuffer = await audiomaker(isiTeks);

        await sock.sendMessage(remoteJid, {
            audio: audioBuffer,
            mimetype: 'audio/mp4',
            ptt: false
        }, { quoted: msg })

    } catch (err) {
        console.error(err);
        await sock.sendMessage(remoteJid, { text: 'Server AI terkena limit!, tunggu 10 menitan baru coba lagi ya!' });
    }
}