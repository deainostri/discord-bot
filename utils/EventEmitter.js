//
class EventEmitter {
    //

    constructor() {
        this._events = {};
    }

    on(eventName, listener) {
        if (typeof listener !== "function") {
            return this;
        }

        if (!this._events[eventName]) {
            this._events[eventName] = [];
        }

        this._events[eventName].push(listener);

        return this;
    }

    off(eventName, listener) {
        if (typeof listener !== "function") {
            return this;
        }

        let listeners = this._events[eventName];

        if (listeners) {
            let index = listeners.indexOf(listener);
            if (index !== -1) {
                listeners.splice(index, 1);
            }
        }

        if (listeners.length === 0) {
            this.offAll(eventName);
        }

        return this;
    }

    once(eventName, listener) {
        let customListener = (...args) => {
            if (typeof listener === "function") {
                listener(...args);
            }

            this.off(eventName, customListener);
        };

        return this.on(eventName, customListener);
    }

    emit(eventName, ...args) {
        let listeners = this._events[eventName];

        if (!listeners) {
            return false;
        }

        listeners.forEach((listener) => listener(...args));

        return true;
    }

    offAll(eventName) {
        delete this._events[eventName];
    }

    listeners(eventName) {
        let listeners = this._events[eventName];
        return listeners ? listeners.slice() : [];
    }

    eventNames() {
        return Object.keys(this._events);
    }
}

module.exports = EventEmitter;
