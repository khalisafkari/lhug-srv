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
exports.productionAnime = exports.productionDetail = void 0;
const cheerio_1 = __importDefault(require("cheerio"));
const connector_1 = require("../connector");
const log_1 = require("../utils/log");
const url_1 = __importDefault(require("./url"));
const get = (page) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const data = yield url_1.default.get(`/production${page ? `?page=${page}` : ''}`, {
            withCredentials: true,
            headers: {
                Cookie: 'loop-view=thumb;'
            }
        });
        const $ = cheerio_1.default.load(data.data);
        const list = $('main .loop li a').map((index, elemenet) => {
            var _a, _b;
            return ({
                id: (_a = $(elemenet).attr('href')) === null || _a === void 0 ? void 0 : _a.trim().replace('https://tenshi.moe/production/', '').replace(/\/[\d+]/gi, ''),
                title: (_b = $(elemenet).attr('title')) === null || _b === void 0 ? void 0 : _b.trim(),
                meta: {
                    image: {
                        alt: $(elemenet).find('img').attr('alt'),
                        url: $(elemenet).find('img').attr('src')
                    }
                }
            });
        }).get();
        const total = $('.page-item').eq(-2).text();
        if (connector_1.convertNumber(page) > connector_1.convertNumber(total)) {
            return {
                message: 'limit'
            };
        }
        else {
            return {
                list,
                count: list.length * (page || 1),
                page: page || 1,
                total: connector_1.convertNumber(total),
                message: 'success'
            };
        }
    }
    catch (e) {
        log_1.error.error(`${e.toString()}`, {
            date: new Date(),
            route: 'production'
        });
        throw new Error(e);
    }
});
const productionDetail = (id) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c, _d;
    if (!id)
        return { message: 'limit' };
    try {
        const data = yield url_1.default.get(`/production/${id}`);
        const $ = cheerio_1.default.load(data.data);
        const title = $('main article header h1').text().trim();
        const image = (_a = $('main article .entry-content div .side-info .cover-area img').attr('src')) === null || _a === void 0 ? void 0 : _a.trim();
        const alt = (_c = (_b = $('main article .entry-content div .side-info .cover-area img').attr('title')) === null || _b === void 0 ? void 0 : _b.trim()) !== null && _c !== void 0 ? _c : (_d = $('main article .entry-content div .side-info .cover-area img').attr('alt')) === null || _d === void 0 ? void 0 : _d.trim();
        const tag = $('main article .entry-content div .main-info .info-list li:nth-child(1) .value').text().trim();
        const site = $('main article .entry-content div .main-info .info-list li:nth-child(2) .value').text().trim();
        const description = $('main article .entry-description .card-body').text().trim();
        return {
            title,
            meta: {
                image: {
                    alt: alt,
                    url: image
                }
            },
            tag,
            site,
            description
        };
    }
    catch (e) {
        log_1.error.error(`${e.toString()}`, {
            date: new Date(),
            route: 'production detail'
        });
        throw new Error(e);
    }
});
exports.productionDetail = productionDetail;
const productionAnime = (id, page) => __awaiter(void 0, void 0, void 0, function* () {
    if (!id)
        return { message: 'limit' };
    try {
        const data = yield url_1.default.get(`/production/${id}${page ? `?page=${page}` : ''}`, {
            withCredentials: true,
            headers: {
                Cookie: 'loop-view=thumb;'
            }
        });
        const $ = cheerio_1.default.load(data.data);
        const list = $('main .loop li a').map((index, elemenet) => {
            var _a, _b;
            return ({
                id: (_a = $(elemenet).attr('href')) === null || _a === void 0 ? void 0 : _a.replace('https://tenshi.moe/anime/', ''),
                title: (_b = $(elemenet).attr('title')) === null || _b === void 0 ? void 0 : _b.trim(),
                meta: {
                    image: {
                        alt: $(elemenet).find('img').attr('alt'),
                        url: $(elemenet).find('img').attr('src')
                    }
                },
                views: $(elemenet).find('.views').text().trim(),
                rate: $(elemenet).find('.rating').text().trim(),
                overlay: $(elemenet).find('.overlay span').text().trim()
            });
        }).get();
        const total = $('.page-item').eq(-2).text();
        if (connector_1.convertNumber(page) > connector_1.convertNumber(total)) {
            return {
                message: 'limit'
            };
        }
        else {
            return {
                list,
                count: list.length * (page || 1),
                page: page || 1,
                total: connector_1.convertNumber(total),
                message: 'success'
            };
        }
    }
    catch (e) {
        log_1.error.error(`${e.toString()}`, {
            date: new Date(),
            route: 'production detail'
        });
        throw new Error(e);
    }
});
exports.productionAnime = productionAnime;
exports.default = (page) => {
    return new Promise((resolve, reject) => {
        get(page).then(resolve).catch(reject);
    });
};
//# sourceMappingURL=production.js.map