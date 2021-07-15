"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const home_1 = __importDefault(require("./home"));
const list_1 = __importDefault(require("./list"));
const post_1 = __importDefault(require("./post"));
const comment_1 = __importDefault(require("./comment"));
const app = express_1.Router();
app.use('/home', home_1.default);
app.use('/list', list_1.default);
app.use('/post', post_1.default);
app.use('/comment', comment_1.default);
exports.default = app;
//# sourceMappingURL=index.js.map