import { login } from "./discord/index.js";
import { sync } from "./models/index.js";
import { pruneCooldowns } from "./prune.js";

try {
    await sync();
    await pruneCooldowns();
    await login();
}
catch (err) {
    console.error(err);
}
