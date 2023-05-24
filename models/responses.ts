import {Response} from "express";

export interface APIResponse {
    status: number,
    message: string,
    data?: any,
    error?: any,
}

export const sendServerErrorResponse = function (e: Error, response: Response) {
    const errorResponse: APIResponse = {
        status: 500,
        message: "Internal Server Error",
    };

    console.log(e);
    console.log(errorResponse);
    response.status(500).json(errorResponse);
};