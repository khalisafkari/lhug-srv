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
const get = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const data = yield url_1.default.get('/');
        const $ = cheerio_1.default.load(data.data);
        const list = {};
        $('.tab-content .tab-pane').each((index, element) => {
            var _a, _b;
            list[`${(_a = $(element).attr('id')) === null || _a === void 0 ? void 0 : _a.trim()}`] = $(element).find('#' + ((_b = $(element).attr('id')) === null || _b === void 0 ? void 0 : _b.trim()) + ' ul li a').map((i, e) => {
                var _a, _b, _c, _d;
                return ({
                    id: (_a = $(e).attr('href')) === null || _a === void 0 ? void 0 : _a.trim().replace('https://tenshi.moe/anime/', ''),
                    title: $(e).find('.overlay span').text().trim(),
                    content: (_b = $(e).attr('data-content')) === null || _b === void 0 ? void 0 : _b.trim(),
                    meta: {
                        image: {
                            url: (_c = $(e).find('img').attr('src')) === null || _c === void 0 ? void 0 : _c.trim(),
                            alt: (_d = $(e).find('img').attr('alt')) === null || _d === void 0 ? void 0 : _d.trim()
                        },
                        views: $(e).find('.views').text().trim(),
                        rate: $(e).find('.rating').text().trim()
                    }
                });
            }).get();
        });
        const latestanime = $('#content section:nth-child(3) ul li a').map((index, element) => {
            var _a, _b, _c, _d;
            return ({
                id: (_a = $(element).attr('href')) === null || _a === void 0 ? void 0 : _a.trim().replace('https://tenshi.moe/anime/', ''),
                title: $(element).find('.overlay span').text().trim(),
                content: (_b = $(element).attr('data-content')) === null || _b === void 0 ? void 0 : _b.trim(),
                meta: {
                    image: {
                        url: (_c = $(element).find('img').attr('src')) === null || _c === void 0 ? void 0 : _c.trim(),
                        alt: (_d = $(element).find('img').attr('alt')) === null || _d === void 0 ? void 0 : _d.trim()
                    },
                    views: $(element).find('.views').text().trim(),
                    rate: $(element).find('.rating').text().trim()
                }
            });
        }).get();
        const latestepisode = $('#content > section:nth-child(4) ul li a').map((index, element) => {
            var _a, _b, _c, _d, _e;
            return ({
                id: (_a = $(element).attr('href')) === null || _a === void 0 ? void 0 : _a.trim().replace('https://tenshi.moe/anime/', '').replace(/\/[\d+]/gi, ''),
                content: (_b = $(element).attr('data-content')) === null || _b === void 0 ? void 0 : _b.trim(),
                title: $(element).find('.overlay .title').text().trim(),
                meta: {
                    image: {
                        url: (_c = $(element).find('img').attr('src')) === null || _c === void 0 ? void 0 : _c.trim(),
                        alt: (_d = $(element).find('img').attr('alt')) === null || _d === void 0 ? void 0 : _d.trim()
                    },
                    views: $(element).find('.views').text().trim(),
                    rate: $(element).find('.rating').text().trim(),
                    episodeTitle: $(element).find('.overlay .episode-title').text().trim(),
                    episodeDate: {
                        title: (_e = $(element).find('.overlay .episode-meta .episode-date').attr('title')) === null || _e === void 0 ? void 0 : _e.trim(),
                        date: $(element).find('.overlay .episode-meta .episode-date').text().trim()
                    },
                    episodeVideo: $(element).find('.overlay .episode-video').text().trim()
                }
            });
        }).get();
        const results = {
            list,
            latestanime,
            latestepisode
        };
        log_1.error.info('success', {
            date: new Date(),
            route: 'home'
        });
        return results;
    }
    catch (e) {
        log_1.error.error(`${e.toString()}`, {
            date: new Date(),
            route: 'home'
        });
        return e;
    }
});
exports.default = () => {
    return new Promise((resolve, reject) => {
        get().then(resolve).catch(reject);
    });
};
//# sourceMappingURL=home.js.map