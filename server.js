// server utils
const logger = require("./utils/logger");
const express = require("express");
const bodyParser = require("body-parser");

// server handlers
const process_new_mint = require("./scripts/server/process_new_mint");
const register_wallet = require("./scripts/server/register_wallet");
const remove_non_holders = require("./scripts/server/remove_non_holders");
const check_remote_address = require("./scripts/server/check_remote_address");

// defs
const PORT = process.env.PORT || 8080;

const start_server = (duration = 30 * 1000) => {
    express()
        .use(bodyParser.json({ extended: true }))
        .use(bodyParser.urlencoded({ extended: true }))
        .post("/announce_new_mint", process_new_mint)
        .post("/check_remote_address", check_remote_address)
        .post("/register_wallet", register_wallet)
        .post("/remove_non_holders", remove_non_holders)
        .listen(PORT, () => logger.info(`Listening on ${PORT}...`));
};

module.exports = start_server;
