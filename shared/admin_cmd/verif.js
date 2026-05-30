import { read_data } from './pool_db.js';

export async function verify(jid) {
    try {
        const res = await read_data({ table: 'data_grup', where: "jid", i: jid });
        if(!res) return ;
        return res[0].id;
    } catch (err) {
        console.error(err)
    }
}