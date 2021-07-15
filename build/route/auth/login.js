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
const sha1_1 = __importDefault(require("sha1"));
const mysql_1 = __importDefault(require("../../utils/mysql"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const connector_1 = require("../../connector");
const app = express_1.Router();
app.get('/', mysql_1.default((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    const body = {
        email: (_a = req.query.email) !== null && _a !== void 0 ? _a : req.body.email,
        pass: (_b = req.query.pass) !== null && _b !== void 0 ? _b : req.body.password
    };
    let data;
    try {
        data = yield req.db.query('select * from w_user where email = ? and password = ?', [body.email, sha1_1.default(body.pass)]);
        if (data.length <= 0) {
            return res.status(403).send(connector_1.errorStatus('forbidden'));
        }
        const results = {
            message: 'success',
            token: jsonwebtoken_1.default.sign({
                id: data[0].id,
                email: data[0].email,
                role: data[0].role
            }, Buffer.from(`${process.env.JWT_TOKEN}`, 'base64'), {
                expiresIn: '365d'
            })
        };
        return res.status(200).send(results);
    }
    catch (e) {
        return res.status(403).send(connector_1.errorStatus('forbidden'));
    }
    finally {
        if (data.length > 0) {
            yield req.db.query('update w_user set last_login = CURRENT_TIMESTAMP where email = ? ', [body.email]);
            console.log(`update at last_login : ${new Date()} email: ${body.email}`);
            yield req.db.end();
        }
    }
})));
exports.default = app;
//# sourceMappingURL=login.js.map