import { getRow, setRow } from "./json_store.js";

export async function getdata(i, table) {
    const data = getRow(table, i);
    if (!data) return null;

    return {
        caption: data?.caption,
        url: data?.url_media,
        type: data?.type,
        conditions: data?.conditions
    };
}

export async function editdata({ table, i, url, caption, type }) {
    if (!["welcome", "leaves"].includes(table)) return null;

    setRow(table, i, {
        id: String(i),
        url_media: url,
        caption,
        type
    });

    return {
        status: "Data Berhasil Diperbarui!",
        caption,
        url: url?.trim() || null
    };
}

export async function editdata_rules({ i, conditions, table }) {
    if (!["on", "off"].includes(conditions) || !["toxic", "spam"].includes(table)) return null;

    setRow(table, i, {
        id: String(i),
        conditions
    });

    return {
        status: "Data Berhasil Diperbarui!",
        conditions
    };
}

export async function poolconnection({ table, i, type, violate = null }) {
    if (!["read", "write"].includes(type)) return;

    if (type === "read") {
        const data = getRow(table, i);
        if (!data) return null;

        return {
            conditions: data?.conditions || null,
            violate: data?.violate || null
        };
    }

    setRow(table, i, {
        id: String(i),
        violate
    });

    return {
        conditions: null,
        violate
    };
}
