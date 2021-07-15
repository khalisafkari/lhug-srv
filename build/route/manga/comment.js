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
const express_jwt_1 = __importDefault(require("express-jwt"));
const mysql_1 = __importDefault(require("../../utils/mysql"));
const app = express_1.Router();
app.use(express_1.json());
app.use(express_1.urlencoded({ extended: false }));
app.route('/:id')
    .get(mysql_1.default((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const comment = yield req.db.query('select * from w_manga_comments where manga = ? order by id asc', [req.params.id]);
    return res.send(comment);
})))
    .post(express_jwt_1.default({ secret: Buffer.from(`${process.env.JWT_TOKEN}`, 'base64'), algorithms: ['HS256'], credentialsRequired: false }), mysql_1.default((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (!req.user) {
        return res.status(403).send('forbidden');
    }
    if (!req.body.message) {
        return res.status(403).send({ message: 'required message value' });
    }
    yield req.db.query('insert into w_manga_comments (manga, content, time, user_id, user_rep) values (?,?,CURRENT_TIMESTAMP,?,?)', [
        req.params.id,
        req.body.message,
        req.user.id,
        0
    ]);
    return res.send('done');
})));
app.route('/:id/ch/:ch')
    .get(mysql_1.default((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const comment = yield req.db.query('select * from w_manga_comments where manga = ? and chapter_id = ?', [req.params.id, req.params.ch]);
    return res.send(comment);
})))
    .post(express_jwt_1.default({ secret: Buffer.from(`${process.env.JWT_TOKEN}`, 'base64'), algorithms: ['HS256'], credentialsRequired: false }), mysql_1.default((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (!req.user) {
        return res.status(403).send('forbidden');
    }
    if (!req.body.message) {
        return res.status(403).send({ message: 'required message value' });
    }
    const getCh = yield req.db.query('select chapter from w_manga_chapters where mid = ? and id = ?', [req.params.id, req.params.ch]);
    yield req.db.query(`
      insert into 
      w_manga_comments (manga, content, time, user_id, user_rep, chapter_id, chapter) 
      values (?,?,CURRENT_TIMESTAMP,?,?,?,?)
      `, [
        req.params.id,
        req.body.message,
        req.user.id,
        0,
        req.params.ch,
        getCh[0].chapter
    ]);
    return res.send({ message: 'success', code: 201, status: 'send' });
})));
exports.default = app;
//# sourceMappingURL=comment.js.map