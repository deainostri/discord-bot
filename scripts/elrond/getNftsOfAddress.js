//
const axios = require("../../utils/axios");

const getNftsOfAddress = async (address) => {
    if (!address) {
        return [];
    }

    const res = await axios.get(
        `https://api.elrond.com/accounts/${address}/nfts?from=0&size=5000&search=DEAINOSTRI-a141fb`
    );

    if (!res || !res.data || !res.data.length) {
        return [];
    }

    return res.data;
};

module.exports = getNftsOfAddress;
