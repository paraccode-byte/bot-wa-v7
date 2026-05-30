import { findRows, setRow } from "../function/json_store.js";

export async function write_data(id, jid, banner, name) {
    return Boolean(setRow("data_grup", id, {
        id: String(id),
        jid,
        banner,
        name
    }));
}

export async function read_data({ table, where, i }) {
    const rows = findRows(table, where, i);
    return rows.length === 0 ? null : rows;
}
