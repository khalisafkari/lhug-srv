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
const express_1 = require("express");
const anime_1 = require("../../anime");
const connector_1 = require("../../connector");
const genre_1 = __importDefault(require("./genre"));
const anime_2 = __importDefault(require("./anime"));
const group_1 = __importDefault(require("./group"));
const production_1 = __importDefault(require("./production"));
const type_1 = __importDefault(require("./type"));
const status_1 = __importDefault(require("./status"));
const source_1 = __importDefault(require("./source"));
const resolution_1 = __importDefault(require("./resolution"));
const content_rating_1 = __importDefault(require("./content-rating"));
const playlist_1 = __importDefault(require("./playlist"));
const app = express_1.Router();
const errorStatus = (res) => {
    return res.status(403).send('Forbidden');
};
app.use('/genre', genre_1.default);
app.use('/anime', anime_2.default);
app.use('/group', group_1.default);
app.use('/production', production_1.default);
app.use('/type', type_1.default);
app.use('/status', status_1.default);
app.use('/source', source_1.default);
app.use('/resolution', resolution_1.default);
app.use('/content-rating', content_rating_1.default);
app.use('/playlist', playlist_1.default);
app.get('/search', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const q = req.query.q;
    const page = connector_1.convertNumber(req.query.page);
    if (!q) {
        return res.status(404).send({
            message: 'not found',
            code: 404
        });
    }
    try {
        const data = yield anime_1.Search(q, page);
        return res.status(200).send(data);
    }
    catch (e) {
        return errorStatus(res);
    }
}));
app.route('/')
    .get((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const data = yield anime_1.Home();
        return res.status(200).send(data);
    }
    catch (e) {
        return errorStatus(res);
    }
}));
app.route('/episode')
    .get((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const page = req.query.page;
    if (!page) {
        const data = yield anime_1.Episode();
        return res.status(200).send(data);
    }
    try {
        const data = yield anime_1.Episode(connector_1.convertNumber(page));
        return res.status(200).send(data);
    }
    catch (e) {
        return errorStatus(res);
    }
}));
app.get('/video', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const url = req.query.url;
    if (!url) {
        return errorStatus(res);
    }
    try {
        const data = yield anime_1.Video(url);
        return res.status(200).send(data);
    }
    catch (e) {
        return errorStatus(res);
    }
}));
exports.default = app;
//# sourceMappingURL=index.js.map