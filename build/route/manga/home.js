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
const slugify_1 = __importDefault(require("slugify"));
const connector_1 = require("../../connector");
const mysql_1 = __importDefault(require("../../utils/mysql"));
const app = express_1.Router();
app.get('/', mysql_1.default((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const data = yield req.db.query('select * from w_setting');
        const todos = {};
        for (let i = 0; i < data.length; i++) {
            todos[slugify_1.default(data[i].title)] = {
                id: data[i].id,
                title: data[i].title,
                data: yield req.db.query(data[i].content)
            };
        }
        return res.status(200).send(todos);
    }
    catch (e) {
        return res.status(403).send(connector_1.errorStatus());
    }
})));
app.get('/:id', mysql_1.default((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    if (!id) {
        return res.status(403).send(connector_1.errorStatus('not valid'));
    }
    try {
        const data = yield req.db.query('select * from w_setting where id = ?', [id]);
        const results = {
            id: data[0].id,
            title: data[0].title,
            data: yield req.db.query(data[0].content)
        };
        return res.send(results);
    }
    catch (e) {
        return res.status(403).send(connector_1.errorStatus());
    }
})));
exports.default = app;
//# sourceMappingURL=home.js.map