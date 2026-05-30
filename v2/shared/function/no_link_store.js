import { readTable, writeTable } from "./json_store.js";

function setNestedValue(target, path, value) {
    const parts = path.split(".");
    let current = target;

    for (const part of parts.slice(0, -1)) {
        current[part] ??= {};
        current = current[part];
    }

    current[parts.at(-1)] = value;
}

export async function add_mongo(id, content) {
    const data = readTable("no_link");
    data[String(id)] = content;
    writeTable("no_link", data);
    return { acknowledged: true, modifiedCount: 1 };
}

export async function view() {
    return new Map(Object.entries(readTable("no_link")));
}

export const LinkModel = {
    async updateOne(_filter, update) {
        const data = readTable("no_link");

        for (const [key, value] of Object.entries(update?.$set || {})) {
            const path = key.startsWith("data.") ? key.slice(5) : key;
            setNestedValue(data, path, value);
        }

        writeTable("no_link", data);
        return { acknowledged: true, modifiedCount: 1 };
    },

    async findOne() {
        return { data: await view() };
    }
};
