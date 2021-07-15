"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Auth = exports.Manga = exports.Anime = void 0;
var anime_1 = require("./anime");
Object.defineProperty(exports, "Anime", { enumerable: true, get: function () { return __importDefault(anime_1).default; } });
var manga_1 = require("./manga");
Object.defineProperty(exports, "Manga", { enumerable: true, get: function () { return __importDefault(manga_1).default; } });
var auth_1 = require("./auth");
Object.defineProperty(exports, "Auth", { enumerable: true, get: function () { return __importDefault(auth_1).default; } });
//# sourceMappingURL=index.js.map