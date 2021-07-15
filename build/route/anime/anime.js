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
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const anime_1 = require("../../anime");
const connector_1 = require("../../connector");
const app = express_1.Router();
app.get('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const page = connector_1.convertNumber(req.query.page);
    try {
        const data = yield anime_1.Anime(page);
        return res.status(200).send(data);
    }
    catch (e) {
        return res.status(403).send('Forbidden');
    }
}));
app.get('/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    if (!id)
        return res.status(403).send(connector_1.errorStatus());
    try {
        const data = yield anime_1.AnimeDetail(id);
        return res.status(200).send(data);
    }
    catch (e) {
        return res.send(connector_1.errorStatus());
    }
}));
app.get('/:id/episode', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    if (!id)
        return res.status(403).send(connector_1.errorStatus());
    try {
        const data = yield anime_1.AnimeEpisode(id);
        return res.status(200).send(data);
    }
    catch (e) {
        return res.status(403).send(connector_1.errorStatus());
    }
}));
exports.default = app;
//# sourceMappingURL=anime.js.map