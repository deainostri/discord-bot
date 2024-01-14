const EventEmitter = require("../utils/EventEmitter");

class RegisterStore {
    //

    constructor() {
        this.map = new Map();
        this.events = new EventEmitter();
    }

    add = (userId, things) => {
        this.map.set(userId, {
            time: Date.now(),
            userId: userId,
            ...(things || {}),
        });
    };

    remove = (userId) => {
        this.map.delete(userId);
    };

    // remove expired items from map (older than 14 minutes)
    removeExpired = () => {
        const max_time = 14 * 60 * 1000;

        this.map.forEach((item, userId) => {
            if (Date.now() - item.time > max_time) {
                this.map.delete(userId);
            }
        });
    };

    get all() {
        return Array.from(this.map.values());
    }
}

module.exports = RegisterStore;
