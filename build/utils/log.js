"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.error = void 0;
const winston_1 = require("winston");
const winston_daily_rotate_file_1 = __importDefault(require("winston-daily-rotate-file"));
const console = winston_1.createLogger({
    transports: [new winston_1.transports.Console()]
});
console.configure({
    level: 'verbose',
    transports: [
        new winston_daily_rotate_file_1.default({
            filename: 'success-%DATE%.log',
            datePattern: 'YYYY-MM-DD-HH',
            zippedArchive: true,
            maxSize: '10m',
            maxFiles: '30d',
            dirname: './log',
            utc: true
        })
    ]
});
exports.error = winston_1.createLogger({
    transports: [
        new winston_1.transports.Console(),
        new winston_daily_rotate_file_1.default({
            filename: 'error-%DATE%.log',
            datePattern: 'YYYY-MM-DD-HH',
            zippedArchive: true,
            maxSize: '10m',
            maxFiles: '30d',
            dirname: './log',
            utc: true
        })
    ],
    level: 'verbose'
});
exports.default = console;
//# sourceMappingURL=log.js.map