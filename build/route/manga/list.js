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
const connector_1 = require("../../connector");
const mysql_1 = __importDefault(require("../../utils/mysql"));
const app = express_1.Router();
app.get('/', mysql_1.default((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const page = req.query.page;
    const count = yield req.db.query('SELECT * from w_manga_mangas');
    const data = yield req.db.query('SELECT * from w_manga_mangas WHERE id > ? ORDER BY id ASC LIMIT 25', [page ? connector_1.convertNumber(page) * 25 : 0]);
    return res.status(200).send({
        data,
        page: page ? connector_1.convertNumber(page) : 0,
        totalPage: Math.ceil(count.length / 25)
    });
})));
app.get('/search', mysql_1.default((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { s, m, a, t, g } = req.query;
    if (Object.keys(req.query).length === 0) {
        return res.status(404).send({ message: 'not found', code: 404 });
    }
    const data = yield req.db.query(`
    select * from w_manga_mangas
    where name LIKE ? OR slug LIKE ? OR other_name LIKE ?
    OR magazine LIKE ? or magazines LIKE ?
    OR authors LIKE ?
    OR trans_group LIKE ?
    OR genres LIKE ?
    ORDER BY id ASC LIMIT 25
  `, [
        `${s ? `%${s}%` : ''}`,
        `${s ? `%${s}%` : ''}`,
        `${s ? `%${s}%` : ''}`,
        `${m ? `%${m}%` : ''}`,
        `${m ? `%${m}%` : ''}`,
        `${a ? `%${a}%` : ''}`,
        `${t ? `%${t}%` : ''}`,
        `${g ? `%${g}%` : ''}`
    ]);
    if (data.length === 0) {
        return res.status(404).send({ message: 'not found', code: 404 });
    }
    return res.send(data);
})));
app.get('/genre', mysql_1.default((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const data = yield req.db.query('select * from w_manga_genres');
        return res.status(200).send(data);
    }
    catch (e) {
        return res.status(403).send('forbidden');
    }
})));
app.get('/mangazine', mysql_1.default((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const data = yield req.db.query('SELECT * FROM `w_manga_magazines`');
        return res.status(200).send(data);
    }
    catch (e) {
        return res.status(403).send('forbidden');
    }
})));
exports.default = app;
//# sourceMappingURL=list.js.map