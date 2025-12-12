import { NextFunction, Request, Response } from "express";
import { getUserData } from "../utils/jwt";
import { IReqUser } from "../utils/interface";
import response from "../utils/response";



export default(req: Request, res: Response, next: NextFunction ) => {
    const authorization = req.headers?.authorization;

    // cek kalau authorizationnya ada
    if(!authorization){
        return response.unauthorized(res)
    }

    // cek kalau struktur authorizationnya: Bearer token
    const [prefix, token] = authorization.split(" ")

    if (!(prefix === "Bearer" && token)) {
        return response.unauthorized(res)
    }

    // cek kalau usernya ada
    const user = getUserData(token)

    if (!user){
        return response.unauthorized(res)
    }

    (req as IReqUser).user = user

    next()
}