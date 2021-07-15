"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const me_1 = __importDefault(require("./me"));
const login_1 = __importDefault(require("./login"));
const app = express_1.Router();
app.use('/me', me_1.default);
app.use('/login', login_1.default);
exports.default = app;
//# sourceMappingURL=index.js.map