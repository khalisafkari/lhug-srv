"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
const express_1 = __importDefault(require("express"));
const Sentry = __importStar(require("@sentry/node"));
const Tracing = __importStar(require("@sentry/tracing"));
const route_1 = require("./route");
const adm_zip_1 = __importDefault(require("adm-zip"));
const node_fetch_1 = __importDefault(require("node-fetch"));
const dotenv_1 = __importDefault(require("dotenv"));
const express_winston_1 = __importDefault(require("express-winston"));
const winston_daily_rotate_file_1 = __importDefault(require("winston-daily-rotate-file"));
const winston_1 = __importDefault(require("winston"));
dotenv_1.default.config();
// import crypto from 'crypto-js'
// console.log(crypto.AES.decrypt('U2FsdGVkX188h7SMyNJ8Dgce7L3iGRuo1DwGiHBtX+Nv8R8jZm9nsfrOce0KnSNSjJC/Ri3bY9UeDxKabc611w==', '267041df55ca2b36f2e322d05ee2c9cf').toString(crypto.enc.Utf8).trim()
// )
const PORT = 3000;
// (async () => {
// })()
const app = express_1.default();
Sentry.init({
    dsn: 'https://9c8dac407eb44c36ade2f2be28034d5e@o121589.ingest.sentry.io/5825606',
    integrations: [
        new Sentry.Integrations.Http({ tracing: true }),
        new Tracing.Integrations.Express({ app })
    ],
    tracesSampleRate: 1.0
});
app.use(Sentry.Handlers.requestHandler());
app.use(Sentry.Handlers.tracingHandler());
app.use(express_winston_1.default.logger({
    transports: [
        new winston_1.default.transports.Console(),
        new winston_daily_rotate_file_1.default({
            filename: 'log-%DATE%.log',
            datePattern: 'YYYY-MM-DD-HH',
            zippedArchive: true,
            maxSize: '10m',
            maxFiles: '10d',
            dirname: './log',
            utc: true
        })
    ],
    format: winston_1.default.format.combine(winston_1.default.format.colorize(), winston_1.default.format.json()),
    meta: false,
    msg: 'HTTP {{req.method}} {{res.responseTime}}ms {{req.url}}',
    expressFormat: false,
    colorize: true,
    ignoreRoute: function (req, res) { return false; }
}));
app.use((req, res, next) => {
    if (req.headers.token === process.env.SECURE_TOKEN) {
        next();
        return;
    }
    return res.status(403).send({
        message: 'forbidden',
        require: 'serial_key',
        code: 403
    });
});
app.get('/zip', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const list = ['https://s4.ihlv1.xyz/images2/20210604/01_60ba06b51ce0f.jpg', 'https://s4.ihlv1.xyz/images2/20210604/01_60ba06b51ce0f.jpg'];
    const adm = new adm_zip_1.default();
    for (let i = 0; i < list.length; i++) {
        const request = yield node_fetch_1.default(list[i], {
            headers: {
                referer: 'https://lovehug.net'
            }
        }).then((res) => res.buffer());
        adm.addFile(`${i}.png`, request);
    }
    const content = adm.toBuffer();
    return res.end(content);
}));
app.use('/anime', route_1.Anime);
app.use('/manga', route_1.Manga);
app.use('/auth', route_1.Auth);
app.use(Sentry.Handlers.errorHandler());
app.use('*', (req, res) => {
    const timerStart = Date.now();
    return res.send({
        message: 'success',
        time: Date.now() - timerStart,
        code: 201
    });
});
app.listen(PORT, () => {
    console.log(`⚡️[server]: Server is running at http://localhost:${PORT}`);
});
//# sourceMappingURL=draft.js.map