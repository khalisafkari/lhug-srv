"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorStatus = exports.convertContent = exports.convertNumber = void 0;
const convertNumber = (req) => {
    return Number(req);
};
exports.convertNumber = convertNumber;
const convertContent = (content) => {
    const todos = [];
    const item = content ? content.split(/\s/g) : [];
    for (let i = 0; i < item.length; i++) {
        if (!(item) || item[i] !== '') {
            if (item) {
                todos.push(item[i]);
            }
        }
    }
    return todos;
};
exports.convertContent = convertContent;
const errorStatus = (message, code) => {
    return {
        message: message || 'Forbidden',
        code: code || 403
    };
};
exports.errorStatus = errorStatus;
// const wrapper = (fn: any) => {
//   return async (req: request, res: Response) => {
//     req.prisma = prisma
//     await req.prisma.$connect()
//     await fn(req, res)
//     await req.prisma.$disconnect()
//   }
// }
// export default wrapper
//# sourceMappingURL=connector.js.map