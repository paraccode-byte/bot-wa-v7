import path from "path";

export default function filepath(location) {
    return path.join(process.cwd(), location);
}