import { JSONFilePreset } from 'lowdb/node'
import filepath from './namefile.js';
import { write_data } from './pool_db.js';

export default async function add(name, jid, url) {
    try {
        const db = await JSONFilePreset(filepath('./database/no_link.json'), {});
        const db_default = await JSONFilePreset(filepath('./database/data-default.json'), {});
        const allkeys = Object.keys(db.data);
        const lastKey = allkeys.length > 0 ? Math.max(...allkeys.map(Number)) : -1;
        const nextKey = (lastKey + 1).toString();
        db.data[nextKey] = db_default.data.data;
        const write = await write_data(nextKey, jid, url, name);
        if (!write) return;
        await db.write();
        return nextKey;
    } catch (error) {
        console.error('Error in add_data.js:', error);
        throw error;
    }
}