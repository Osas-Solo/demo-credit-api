"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendServerErrorResponse = void 0;
const sendServerErrorResponse = function (e, response) {
    const errorResponse = {
        status: 500,
        message: "Internal Server Error",
    };
    console.log(e);
    console.log(errorResponse);
    response.status(500).json(errorResponse);
};
exports.sendServerErrorResponse = sendServerErrorResponse;
