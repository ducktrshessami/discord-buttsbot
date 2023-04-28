import { readdirSync, readFileSync } from "fs";
import { join } from "path";
import { fileURLToPath } from "url";

const configDir = fileURLToPath(new URL("../config", import.meta.url));
const config: Config = {};

readdirSync(configDir)
    .filter(file => file.slice(-5) === ".json")
    .forEach(file => {
        const name = file.slice(0, -5);
        const raw = readFileSync(join(configDir, file), { encoding: "utf8" });
        config[name] = JSON.parse(raw);
    });

type Config = {
    [key: string]: any
};

export default config;
