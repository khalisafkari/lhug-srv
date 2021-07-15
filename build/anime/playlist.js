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
exports.playListId = void 0;
const cheerio_1 = __importDefault(require("cheerio"));
const connector_1 = require("../connector");
const log_1 = require("../utils/log");
const url_1 = __importDefault(require("./url"));
const get = (page) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const data = yield url_1.default.get(`/playlist${page ? `?page=${page}` : ''}`, {
            withCredentials: true,
            headers: {
                Cookie: 'loop-view=thumb;'
            }
        });
        const $ = cheerio_1.default.load(data.data);
        const list = $('main .loop li .playlist').map((index, elemenet) => {
            var _a;
            return ({
                id: (_a = $(elemenet).find('a').attr('href')) === null || _a === void 0 ? void 0 : _a.trim().replace('https://tenshi.moe/playlist/', '').replace('/1', ''),
                title: $(elemenet).find('.playlist-detail a').text().trim(),
                meta: {
                    image: {
                        alt: $(elemenet).find('a img').attr('alt'),
                        url: $(elemenet).find('a img').attr('src')
                    }
                },
                admin: {
                    name: $(elemenet).find('.playlist-detail .admin a').text(),
                    url: $(elemenet).find('.playlist-detail .admin a').attr('href')
                },
                info: {
                    count: $(elemenet).find('.playlist-detail .playlist-info .playlist-video-count').text(),
                    date: $(elemenet).find('.playlist-detail .playlist-info .playlist-last-update').text()
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
            route: 'playlist'
        });
        return e;
    }
});
const playListId = (id) => __awaiter(void 0, void 0, void 0, function* () {
    if (!id) {
        return {
            message: 'limit'
        };
    }
    try {
        const data = yield url_1.default.get(`/playlist/${id}/1`);
        const $ = cheerio_1.default.load(data.data);
        const list = $('.playlist-items li a').map((index, element) => {
            var _a, _b, _c;
            return ({
                id: (_a = $(element).attr('href')) === null || _a === void 0 ? void 0 : _a.trim(),
                idx: $(element).find('.idx').text().trim(),
                meta: {
                    image: {
                        alt: $(element).find('.cvr img').attr('alt'),
                        url: $(element).find('.cvr img').attr('src')
                    }
                },
                dtl: {
                    tt: $(element).find('.dtl .vdo_ttl_anm').text().trim(),
                    eps: $(element).find('.dtl .vdo_ttl_eps').text().trim()
                },
                mta: {
                    type: $(element).find('.mta span:nth-child(1)').text().trim(),
                    audio: (_b = $(element).find('.mta span:nth-child(2) span').attr('title')) === null || _b === void 0 ? void 0 : _b.trim().replace('Audio: ', ''),
                    subtitle: (_c = $(element).find('.mta span:nth-child(3) span').attr('title')) === null || _c === void 0 ? void 0 : _c.trim().replace('Subtitle: ', '')
                }
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
            route: 'playlist_id'
        });
        return e;
    }
});
exports.playListId = playListId;
exports.default = (page) => {
    return new Promise((resolve, reject) => {
        get(page).then(resolve).catch(reject);
    });
};
//# sourceMappingURL=playlist.js.map