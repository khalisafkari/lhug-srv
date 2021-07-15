"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.cancel = void 0;
const axios_1 = __importDefault(require("axios"));
const core = axios_1.default.create({
    baseURL: 'https://tenshi.moe'
});
exports.cancel = axios_1.default.CancelToken.source();
exports.default = core;
//# sourceMappingURL=url.js.map