import express from "express";
import {  merge} from "lodash";
import { getUserBysessionToken } from "../models/user";

export const isAuthentcated = async(req:express.Request,res:express.Response,next:express.NextFunction):Promise<void | express.Response<any, Record<string, any>>> => {
    try {
      const sessionToken = req.cookies["AUTH_COOKIE"];
      if(!sessionToken) {
        return res.sendStatus(403);
      }
      const existingUser = await getUserBysessionToken(sessionToken);
      if(!existingUser) {
        return res.sendStatus(403)
      }
      merge(req , {identity:existingUser});
      return next();
    }
    catch(error){
      console.log(error);
      return res.sendStatus(400);
    }
}