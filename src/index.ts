import { login } from "./discord/index.js";
import { sync } from "./models/index.js";

try {
    await sync();
    await login();
}
catch (err) {
    console.error(err);
}
