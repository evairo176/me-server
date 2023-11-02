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
Object.defineProperty(exports, "__esModule", { value: true });
exports.authMiddleware = void 0;
const prisma_client_1 = require("../../lib/prisma-client");
const expressAsyncHandler = require("express-async-handler");
const jwt = require("jsonwebtoken");
exports.authMiddleware = expressAsyncHandler((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    let token;
    if ((_b = (_a = req === null || req === void 0 ? void 0 : req.headers) === null || _a === void 0 ? void 0 : _a.authorization) === null || _b === void 0 ? void 0 : _b.startsWith("Bearer")) {
        token = req.headers.authorization.split(" ")[1];
        try {
            if (token) {
                const decoded = jwt.verify(token, process.env.JWT_KEY);
                const { id, iat, exp } = decoded;
                // find the user by id
                const user = yield prisma_client_1.prisma.user.findFirst({
                    where: {
                        id: id,
                    },
                    select: {
                        id: true,
                        fullname: true,
                        email: true,
                        username: true,
                        profile_img: true,
                    },
                });
                // attach the user to the request object
                // console.log(user);
                req.user = user;
                req.token_detail = { iat, exp };
                next();
            }
        }
        catch (error) {
            return res.status(401).send({
                message: "Authorization error",
            });
        }
    }
    else {
        throw new Error("There is no token attached to the header");
    }
}));
//# sourceMappingURL=index.js.map