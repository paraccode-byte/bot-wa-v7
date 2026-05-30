import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export function menu(name) {
    try {
        const data_menu = fs.readFileSync(path.join(__dirname, ("./menu.txt")), "utf-8");
        return data_menu.replaceAll("{name}", name);
    } catch (err) {
        console.error(err);
    }
}
