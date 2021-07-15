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
exports.AnimeEpisode = exports.AnimeDetail = void 0;
const cheerio_1 = __importDefault(require("cheerio"));
const connector_1 = require("../connector");
const log_1 = require("../utils/log");
const url_1 = __importDefault(require("./url"));
const get = (page) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const data = yield url_1.default.get(`/anime${page ? `?page=${page}` : ''}`, {
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
            route: 'anime'
        });
        throw new Error(e);
    }
});
const AnimeDetail = (id) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s;
    if (!id)
        return { message: 'limit' };
    try {
        const data = yield url_1.default.get(`/anime/${id}`);
        const $ = cheerio_1.default.load(data.data);
        const meta = {
            image: {
                url: (_a = $('main article .entry-content .entry-info .side-info .cover-area img').attr('src')) === null || _a === void 0 ? void 0 : _a.trim(),
                alt: (_b = $('main article .entry-content .entry-info .side-info .cover-area img').attr('title')) === null || _b === void 0 ? void 0 : _b.trim()
            }
        };
        const sections = {
            offcial: {
                title: $('main article .entry-content .entry-info .main-info .info-list .official-title .info-box .value').map((index, element) => {
                    var _a;
                    return ({
                        country: (_a = $(element).find('span').attr('title')) === null || _a === void 0 ? void 0 : _a.trim(),
                        title: $(element).text().trim()
                    });
                }).get()
            },
            synonym: $('main article .entry-content .entry-info .main-info .info-list .synonym .info-box .value').text().trim(),
            short: $('main article .entry-content .entry-info .main-info .info-list .short .info-box .value').text().trim(),
            genre: $('main article .entry-content .entry-info .main-info .info-list .genre .value a').map((index, element) => {
                var _a;
                return ({
                    id: (_a = $(element).attr('href')) === null || _a === void 0 ? void 0 : _a.trim().replace('https://tenshi.moe/genre/', ''),
                    titlte: $(element).text().trim()
                });
            }).get(),
            type: {
                id: (_c = $('main article .entry-content .entry-info .main-info .info-list .type .value a').attr('href')) === null || _c === void 0 ? void 0 : _c.trim().replace('https://tenshi.moe/type/', ''),
                title: (_d = $('main article .entry-content .entry-info .main-info .info-list .type .value a').text()) === null || _d === void 0 ? void 0 : _d.trim().replace('https://tenshi.moe/type/', '')
            },
            status: {
                id: (_e = $('main article .entry-content .entry-info .main-info .info-list .status .value a').attr('href')) === null || _e === void 0 ? void 0 : _e.trim().replace('https://tenshi.moe/status/', ''),
                title: (_f = $('main article .entry-content .entry-info .main-info .info-list .status .value a').text()) === null || _f === void 0 ? void 0 : _f.trim()
            },
            'release-date': {
                id: (_g = $('main article .entry-content .entry-info .main-info .info-list .release-date .value').attr('title')) === null || _g === void 0 ? void 0 : _g.trim(),
                title: (_h = $('main article .entry-content .entry-info .main-info .info-list .release-date .value').text()) === null || _h === void 0 ? void 0 : _h.trim()
            },
            views: connector_1.convertNumber((_j = $('main article .entry-content .entry-info .main-info .info-list .views .value').text()) === null || _j === void 0 ? void 0 : _j.trim()),
            'content-rating': {
                id: (_k = $('main article .entry-content .entry-info .main-info .info-list .content-rating .value a').attr('href')) === null || _k === void 0 ? void 0 : _k.trim().replace('https://tenshi.moe/content-rating/', ''),
                title: (_l = $('main article .entry-content .entry-info .main-info .info-list .content-rating .value a').text()) === null || _l === void 0 ? void 0 : _l.trim()
            },
            production: $('main article .entry-content .entry-info .main-info .info-list .production .value a').map((index, element) => {
                var _a;
                return ({
                    id: (_a = $(element).attr('href')) === null || _a === void 0 ? void 0 : _a.trim().replace('https://tenshi.moe/production/', ''),
                    title: $(element).text().trim()
                });
            }).get(),
            source: $('main article .entry-content .entry-info .main-info .info-list .source .value a').map((index, element) => {
                var _a;
                return ({
                    id: (_a = $(element).attr('href')) === null || _a === void 0 ? void 0 : _a.trim().replace('https://tenshi.moe/source/', ''),
                    title: $(element).text().trim()
                });
            }).get(),
            resolution: $('main article .entry-content .entry-info .main-info .info-list .resolution .value a').map((index, element) => {
                var _a;
                return ({
                    id: (_a = $(element).attr('href')) === null || _a === void 0 ? void 0 : _a.trim().replace('https://tenshi.moe/resolution/', ''),
                    title: $(element).text().trim()
                });
            }).get(),
            group: {
                id: (_m = $('main article .entry-content .entry-info .main-info .info-list .group .value a').attr('href')) === null || _m === void 0 ? void 0 : _m.trim().replace('https://tenshi.moe/group/', ''),
                title: $('main article .entry-content .entry-info .main-info .info-list .group .value a').text().trim()
            },
            audio: {
                id: (_o = $('main article .entry-content .entry-info .main-info .info-list .audio a').attr('href')) === null || _o === void 0 ? void 0 : _o.trim().replace('https://tenshi.moe/anime?q=', ''),
                title: (_p = $('main article .entry-content .entry-info .main-info .info-list .audio a').attr('title')) === null || _p === void 0 ? void 0 : _p.trim()
            },
            subtitle: {
                id: (_q = $('main article .entry-content .entry-info .main-info .info-list .subtitle a').attr('href')) === null || _q === void 0 ? void 0 : _q.trim().replace('https://tenshi.moe/anime?q=', ''),
                title: (_r = $('main article .entry-content .entry-info .main-info .info-list .subtitle a').attr('title')) === null || _r === void 0 ? void 0 : _r.trim()
            },
            description: (_s = $('main article .entry-content .entry-description .card-body').text()) === null || _s === void 0 ? void 0 : _s.trim()
        };
        const similar = $('#entry-similar ul li a').map((index, element) => {
            var _a, _b, _c, _d;
            return ({
                id: (_a = $(element).attr('href')) === null || _a === void 0 ? void 0 : _a.trim().replace('https://tenshi.moe/anime/', ''),
                title: (_b = $(element).attr('data-original-title')) === null || _b === void 0 ? void 0 : _b.trim(),
                meta: {
                    image: {
                        alt: (_c = $(element).find('img').attr('alt')) === null || _c === void 0 ? void 0 : _c.trim(),
                        url: (_d = $(element).find('img').attr('src')) === null || _d === void 0 ? void 0 : _d.trim()
                    }
                },
                views: $(element).find('.views').text().trim(),
                rate: $(element).find('.rating').text().trim(),
                overlay: $(element).find('.overlay span').text().trim()
            });
        }).get();
        return Object.assign(Object.assign({ title: $('main article header h1').text().trim(), meta }, sections), { similar, message: 'success' });
    }
    catch (e) {
        log_1.error.error(`${e.toString()}`, {
            date: new Date(),
            route: 'anime detail'
        });
        throw new Error(e);
    }
});
exports.AnimeDetail = AnimeDetail;
const AnimeEpisode = (id) => __awaiter(void 0, void 0, void 0, function* () {
    if (!id)
        return { message: 'limit' };
    try {
        const data = yield url_1.default.get(`/anime/${id}/1`);
        const $ = cheerio_1.default.load(data.data);
        const list = $('.playlist-episodes li a').map((index, element) => {
            var _a, _b, _c, _d;
            return ({
                id: (_a = $(element).attr('href')) === null || _a === void 0 ? void 0 : _a.trim(),
                title: (_b = $(element).attr('title')) === null || _b === void 0 ? void 0 : _b.trim(),
                meta: {
                    image: {
                        alt: (_c = $(element).find('.eps_cvr img').attr('alt')) === null || _c === void 0 ? void 0 : _c.trim(),
                        url: (_d = $(element).find('.eps_cvr img').attr('src')) === null || _d === void 0 ? void 0 : _d.trim()
                    }
                },
                date: $(element).find('.eps_dte').text().trim()
            });
        }).get();
        return {
            list,
            total: list.length,
            message: 'success'
        };
    }
    catch (e) {
        log_1.error.error(`${e.toString()}`, {
            date: new Date(),
            route: 'anime episode'
        });
        throw new Error(e);
    }
});
exports.AnimeEpisode = AnimeEpisode;
exports.default = (page) => {
    return new Promise((resolve, reject) => {
        get(page).then(resolve).catch(reject);
    });
};
//# sourceMappingURL=anime.js.map