"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const cheerio_1 = __importDefault(require("cheerio"));
const log_1 = require("../utils/log");
const url_1 = __importDefault(require("./url"));
const get = (url) => __awaiter(void 0, void 0, void 0, function* () {
    if (!url) {
        return {
            message: 'limit'
        };
    }
    try {
        const data = yield url_1.default.get(url);
        const $ = cheerio_1.default.load(data.data);
        const list = $('video source').map((index, element) => {
            var _a, _b, _c;
            return ({
                id: (_a = $(element).attr('src')) === null || _a === void 0 ? void 0 : _a.trim(),
                title: (_b = $(element).attr('title')) === null || _b === void 0 ? void 0 : _b.trim(),
                type: (_c = $(element).attr('type')) === null || _c === void 0 ? void 0 : _c.trim()
            });
        }).get();
        return {
            list,
            message: 'success'
        };
    }
    catch (e) {
        log_1.error.error(`${e.toString()}`, {
            date: new Date(),
            route: 'source'
        });
        return e;
    }
});
exports.default = (url) => {
    return new Promise((resolve, reject) => {
        get(url).then(resolve).catch(reject);
    });
};
//# sourceMappingURL=video.js.map