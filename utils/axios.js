const axios = require("axios").default;
const axios_client = axios.create({
    timeout: 10000,
});

module.exports = axios_client;
