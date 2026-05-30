import fs from "fs";
import path from "path";

function resolveDatabaseFile(table) {
    return path.join(process.cwd(), "database", `${table}.json`);
}

export function readJsonFile(filePath, fallback = {}) {
    try {
        if (!fs.existsSync(filePath)) {
            fs.mkdirSync(path.dirname(filePath), { recursive: true });
            fs.writeFileSync(filePath, JSON.stringify(fallback, null, 2));
            return fallback;
        }

        const raw = fs.readFileSync(filePath, "utf-8").trim();
        return raw ? JSON.parse(raw) : fallback;
    } catch (error) {
        console.error(`Gagal membaca JSON ${filePath}:`, error);
        return fallback;
    }
}

export function writeJsonFile(filePath, data) {
    fs.mkdirSync(path.dirname(filePath), { recursive: true });
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
}

export function readTable(table) {
    return readJsonFile(resolveDatabaseFile(table), {});
}

export function writeTable(table, data) {
    writeJsonFile(resolveDatabaseFile(table), data);
}

export function rowsFromTable(table) {
    const data = readTable(table);
    return Object.entries(data).map(([key, value]) => {
        if (value && typeof value === "object" && !Array.isArray(value)) {
            return { id: value.id ?? key, ...value };
        }

        return { id: key, value };
    });
}

export function findRows(table, where, i) {
    return rowsFromTable(table).filter((row) => String(row?.[where]) === String(i));
}

export function getRow(table, id) {
    const data = readTable(table);
    return data[String(id)] ?? null;
}

export function setRow(table, id, value) {
    const data = readTable(table);
    data[String(id)] = value;
    writeTable(table, data);
    return value;
}
