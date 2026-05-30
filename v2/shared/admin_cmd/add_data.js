import { JSONFilePreset } from 'lowdb/node';
import filepath from './namefile.js';
import { write_data } from './pool_db.js';
import { view, add_mongo } from "./no_link_store.js";

export default async function add(name, jid, url) {
    try {
        const db = await view(); 
        const db_default = await JSONFilePreset(filepath('./database/data-default.json'), {});

        const allkeys = Array.from(db.keys());
        const lastKey = allkeys.length > 0 ? Math.max(...allkeys.map(Number)) : -1;
        const nextKey = (lastKey + 1).toString();
        const result_mongo = await add_mongo(nextKey, db_default.data.data);
        if(!result_mongo) return null;

        const write = await write_data(nextKey, jid, url, name);
        
        return nextKey;
    } catch (error) {
        console.error('Error in add_data.js:', error);
        throw error;
    }
}
