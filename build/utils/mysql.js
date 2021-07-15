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
const mariadb_1 = __importDefault(require("mariadb"));
const sql = mariadb_1.default.createPool({
    host: '127.0.0.1',
    user: 'lovehug',
    password: 'lovehugdotcom@@',
    connectionLimit: 10,
    database: 'lovehug'
});
const wrapper = (fn) => {
    return (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        req.db = yield sql.getConnection();
        yield req.db.ping();
        yield fn(req, res);
        yield req.db.end();
    });
};
exports.default = wrapper;
//# sourceMappingURL=mysql.js.map