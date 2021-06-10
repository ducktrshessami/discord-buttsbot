const express = require("express");
const cycle = require("express-cycle");

const app = express();
const PORT = process.env.PORT || 8080;
const cycler = cycle({ origin: process.env.PUBLIC_ORIGIN || `http://localhost:${PORT}` });

app.use(cycler);

app.listen(PORT, function () {
    console.log(`Listening on PORT ${PORT}`);
    cycler.startLoop();
});
