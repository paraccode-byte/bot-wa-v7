async function get_time(regions) {
    const wi = { wit: "Asia%2FJayapura", wita: "Asia%2FMakassar", wib: "Asia%2FJakarta" };
    const region = wi[regions];
    const res = await fetch(`https://api.myquran.com/v3/sholat/jadwal/eda80a3d5b344bc40f3bc04f65b7a357/today?tz=${region}`, {
        headers: { "Accept": "application/json" }
    })
    if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
    const json = await res.json();
    const jadwal = Object.values(json.data.jadwal)[0]
    const format = `
┏━━━━━━━━━━━━━━━━━━┓
🕌 JADWAL SHOLAT HARI INI
┗━━━━━━━━━━━━━━━━━━┛
📅 Tanggal: ${jadwal.tanggal}

⏳ Imsak   : ${jadwal.imsak}
🌅 Subuh   : ${jadwal.subuh}
☀️ Dhuha   : ${jadwal.dhuha}
🌞 Dzuhur  : ${jadwal.dzuhur}
⛅ Ashar   : ${jadwal.ashar}
🌇 Maghrib : ${jadwal.maghrib}
🌙 Isya    : ${jadwal.isya}

"Shalatlah tepat pada waktunya."
`;
    return format;
}

export default async function jadwalsholat({ remoteJid, sock, text, msg }) {
    const isiTeks = text.replace('.jadwalsholat', '').trim();
    if (!isiTeks) return await sock.sendMessage(remoteJid, { text: "Masukan region kamu, contoh: .jadwalsholat wib" })
    try {
        const time = await get_time(isiTeks)
        await sock.sendMessage(remoteJid, {
            text: time
        }, { quoted: msg });

    } catch (err) {
        console.error(err);
        await sock.sendMessage(remoteJid, { text: 'Terjadi kesalahan sistem.' });
    }
}