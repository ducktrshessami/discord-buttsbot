try {
    require("dotenv").config();
}
catch {
    console.warn("Not using dotenv. Make sure environment variables are set");
}

const fs = require("fs");
const path = require("path");

const basename = path.basename(__filename);
const files = fs
    .readdirSync(__dirname)
    .filter(file =>
        (file.indexOf(".") !== 0) &&
        (file !== basename) &&
        (file.slice(-3) === ".js")
    )
    .map(file => path.join(__dirname, file));

async function build() {
    for (const file of files) {
        await require(file);
    }
}

build()
    .catch(err => {
        console.error(err);
        process.exit(1);
    });
