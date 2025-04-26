import { NextFunction, Response } from "express";
import { ExtendedRequest, TokenDetails } from "../interfaces/assist.doc.interfaces";
import jwt from "jsonwebtoken";

export const verifyToken = (req: ExtendedRequest, res: Response, next: NextFunction) => {

  let token = req.signedCookies.token;

  if (!token) {
    res.status(400).json({
      'success': false,
      'error': 'You are not allowed to access this service. Login.'
    });
  }

  try {

    jwt.verify(token, process.env.SECRET_KEY as string, (error: any, data: any) => {
      if (error) {
        if (error.name === 'JsonWebTokenError') {
          res.status(401).json({
            'success': false,
            'error': 'Invalid token provided.'
          });
        } else if (error.name === 'TokenExpiredError') {
          res.status(401).json({
            'success': false,
            'error': 'Token expired. Login again.'
          });
        } else {
          res.status(500).json({
            'success': false,
            'error': 'An error occurred while verifying the token.'
          });
        }
      } else {
        req.info = data as TokenDetails;
        next();
      }
    })
    
  } catch (error) {
    res.status(403).json({
      'success': false,
      'error': 'Invalid token provided.'
    });
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
    res.status(401).json({
      'success': false,
      'error': 'You are not allowed to access this service. Login.'
    });
  }

  if (data.Role!== 'Doctor') {
    res.status(401).json({
      'success': false,
      'error': 'You do not have the necessary permissions to access this service.'
    });
  } else {
    next();
  }
}