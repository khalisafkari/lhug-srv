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
app.get('/:id', mysql_1.default((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const data = yield req.db.query(`
  select w_manga_mangas.*, COUNT(w_manga_bookmark.id) as fav 
  from w_manga_mangas 
  INNER JOIN w_manga_bookmark 
  ON w_manga_mangas.id = w_manga_bookmark.manga 
  where w_manga_mangas.id = ?
  `, [req.params.id]);
    const genres = data[0].genres ? data[0].genres.split(',') : [];
    return res.send(Object.assign(Object.assign({}, data[0]), { genres }));
})));
app.get('/:id/chapter', mysql_1.default((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const data = yield req.db.query('select id, name, chapter, mid, manga, views, last_update, submitter, hidden from w_manga_chapters where mid = ? ORDER BY id ASC', [req.params.id]);
    return res.send(data);
})));
app.get('/:id/chapter/:chapter', mysql_1.default((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const data = yield req.db.query('select * from w_manga_chapters where mid = ? and id = ?', [req.params.id, req.params.chapter]);
    const next = yield req.db.query('select id, name, chapter, mid, manga, views, last_update, submitter, hidden from w_manga_chapters where mid = ? and id > ? order by id asc limit 1', [req.params.id, data[0].id]);
    const prev = yield req.db.query('select id, name, chapter, mid, manga, views, last_update, submitter, hidden from w_manga_chapters where mid = ? and id < ? order by id asc limit 1', [req.params.id, data[0].id]);
    return res.send({
        data: data[0]
            ? Object.assign(Object.assign({}, data[0]), { content: connector_1.convertContent(data[0].content) }) : null,
        prev: prev[0] ? prev[0] : null,
        next: next[0] ? next[0] : null
    });
})));
exports.default = app;
//# sourceMappingURL=post.js.map