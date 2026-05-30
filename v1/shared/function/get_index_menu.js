import fs from "fs";

const teks = fs.readFileSync('./menu.txt', 'utf-8');

let matches = teks.match(/┏『[\s\S]*?┗━━━━━━━━━━━━━━━━⊱/g);

for(const key in matches){
    console.log(`index ke ${key}`, matches[key])
}