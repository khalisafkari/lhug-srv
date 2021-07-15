"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const url_1 = require("url");
const crypto_1 = __importDefault(require("crypto"));
function gravatarUrl(identifier, options) {
    if (!identifier) {
        throw new Error('Please specify an identifier, such as an email address');
    }
    if (identifier.includes('@')) {
        identifier = identifier.toLowerCase().trim();
    }
    const baseUrl = new url_1.URL('https://gravatar.com/avatar/');
    baseUrl.pathname += crypto_1.default.createHash('md5').update(identifier).digest('hex');
    baseUrl.search = new url_1.URLSearchParams(options);
    return baseUrl.toString();
}
exports.default = gravatarUrl;
//# sourceMappingURL=gravatarUrl.js.map