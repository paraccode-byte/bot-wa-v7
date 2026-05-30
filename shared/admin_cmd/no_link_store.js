import { readTable, writeTable } from "../function/json_store.js";

export async function add_mongo(id, content) {
    const data = readTable("no_link");
    data[String(id)] = content;
    writeTable("no_link", data);
    return { acknowledged: true, modifiedCount: 1 };
}

export async function view() {
    return new Map(Object.entries(readTable("no_link")));
}
