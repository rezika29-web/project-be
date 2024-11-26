"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.prototypeHelper = exports.PrototypeHelper = void 0;
class PrototypeHelper {
    applyAll() {
        // String
        Object.assign(String.prototype, {
            toTitleCase() {
                const sentence = String(this).toLowerCase().split(" ");
                for (let i = 0; i < sentence.length; i++) {
                    if (sentence[i].length > 0) {
                        sentence[i] = sentence[i][0].toUpperCase() + sentence[i].slice(1);
                    }
                }
                return sentence.join(" ");
            },
            isValidEmail() {
                // return true
                const key = String(this)
                    .toLowerCase()
                    .match(/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/);
                return key ? true : false;
            },
        });
    }
}
exports.PrototypeHelper = PrototypeHelper;
exports.prototypeHelper = new PrototypeHelper();
