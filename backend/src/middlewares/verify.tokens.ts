import { NextFunction, Response } from "express";
import { ExtendedRequest, TokenDetails } from "../interfaces/assist.doc.interfaces";
import jwt from "jsonwebtoken";
import { FormattedResponse } from "../interfaces/helper/service.response";

export const verifyToken = (req: ExtendedRequest, res: Response, next: NextFunction) => {

  let token = req.signedCookies.token;

  if (!token) {
    res.status(400).json(FormattedResponse.failure('You are not allowed to access this service. Login.', 'Authentication Error'));
  }

  try {

    jwt.verify(token, process.env.SECRET_KEY as string, (error: any, data: any) => {
      if (error) {
        if (error.name === 'JsonWebTokenError') {
          res.status(400).json(FormattedResponse.failure("Invalid token provided.", "Unauthorized"));
        } else if (error.name === 'TokenExpiredError') {
          res.status(400).json(FormattedResponse.failure("Token expired. Login again.", "Unauthorized"));
        } else {
          res.status(500).json(FormattedResponse.failure("An error occurred while verifying the token.", "Server Error"));
        }
      } else {
        req.info = data as TokenDetails;
        next();
      }
    })
    
  } catch (error) {
    res.status(403).json(FormattedResponse.failure("An error occurred while verifying the token.", "Server Error"));
  }
}

export const getIdFromToken = (req: ExtendedRequest): string => {
  
  let data = req.info as TokenDetails;

  if (!data) {
    return ''
  }

  if (!data.UserId) {
    return ''
  }

  return data.UserId;
} 

export const verifyAdmin = (req: ExtendedRequest, res: Response, next: NextFunction) => {

  let data = req.info as TokenDetails;

  if (!data) {
    res.status(401).json(FormattedResponse.failure("You are not allowed to access this service. Login.", "Unauthorized"));
  }

  if (data.Role!== 'Doctor') {
    res.status(401).json(FormattedResponse.failure("You do not have the necessary permissions to access this service.", "Unauthorized"));
  } else {
    next();
  }
}