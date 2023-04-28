import {
    writeFileSync,
    existsSync,
    readdirSync,
    lstatSync
} from "fs";
import { minify } from "minify";
import { join } from "path";
import { fileURLToPath } from "url";

const DIST = fileURLToPath(new URL("dist", import.meta.url));

async function minifyFile(path) {
    try {
        const minified = await minify(path, {
            js: { module: true }
        });
        writeFileSync(path, minified);
    }
    catch (err) {
        err.filename = path;
        throw err;
    }
}

async function minifyDir(path) {
    const files = readdirSync(path);
    await Promise.all(files.map(async file => {
        const filepath = join(path, file);
        const stats = lstatSync(filepath);
        if (stats.isDirectory()) {
            return minifyDir(filepath);
        }
        else if (file.indexOf(".") !== 0 && file.slice(-3) === ".js") {
            return minifyFile(filepath);
        }
    }));
}

try {
    if (existsSync(DIST)) {
        await minifyDir(DIST);
    }
    else {
        console.log(`/dist does not exist. Skipping minification`);
    }
}
catch (err) {
    console.error(err);
}
