const RegisterStore = require("./RegisterStore");

class RootStore {
    //
    constructor() {
        this.register = new RegisterStore();
        this.discordClient = null;
    }
}

module.exports = new RootStore();
