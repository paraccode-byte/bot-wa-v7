import * as dl from 'btch-downloader';

const getDeep = (obj, path) => {
    return path.split('.').reduce((acc, part) => {
        const match = part.match(/(\w+)\[(\d+)\]/);
        if (match) {
            return acc && acc[match[1]] ? acc[match[1]][match[2]] : undefined;
        }
        return acc && acc[part] !== undefined ? acc[part] : undefined;
    }, obj);
}

export default async function download(link, nameVar, lokasi) {
    const targetFunc = dl[nameVar]; 
    if (!targetFunc) throw new Error(`Fungsi ${nameVar} tidak ditemukan!`);
    const data = await targetFunc(link);
    if (!data) throw new Error("Data tidak ditemukan dari API!");
    const videoUrl = getDeep(data, lokasi);
    if (!videoUrl) {
        console.log("Struktur data yang diterima:", JSON.stringify(data, null, 2));
        throw new Error("Kena limit bro, coba 10 detik lagi yak\npastinkan link *vidio/foto* nya benar bro!.");
    }
    const response = await fetch(videoUrl);
    if (!response.ok) throw new Error("Gagal mengunduh file dari server penyedia.");
    
    const arrayBuffer = await response.arrayBuffer();
    return Buffer.from(arrayBuffer);
}