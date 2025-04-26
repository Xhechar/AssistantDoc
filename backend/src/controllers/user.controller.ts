import { User } from "@prisma/client";
import { RegisterUserDto, UpdateUserDto } from "../interfaces/assist.doc.dtos";
import { ServiceResponse } from "../interfaces/assist.doc.interfaces";
import { UserService } from "../services/user.service";
import { Request, Response } from "express";
import { FormattedResponse } from "../interfaces/helper/service.response";

let userService = new UserService();

export class UserController {
    registerUser(req: Request, res: Response) {
        
    }
    
    async loginUser(req: Request, res: Response) {
        try {
            
            let result = await userService.loginUser(req.body);
            
            if(result.success) {
                res.cookie('token', result.token as string, {
                    httpOnly: true,
                    secure: false,
                    sameSite: 'strict',
                    maxAge: 15*60*1000,
                    signed: true
                });
                
                let {token, ...rest} = result;
                return res.status(201).json(rest);
            }
            
            return res.status(201).json(result);
        } catch (error) {
            return res.status(501).json({
                error: error
            });
        }
    }

    async logoutUser(req: Request, res: Response) {
        try {
            res.clearCookie('token', {signed: true});

            return res.status(201).json(FormattedResponse.success('logout successfully, you are always welcomed'));
        } catch(error) {
        return res.status(501).json({
            'error': error
        })
        }
    }

    getUserById(userId: string): Promise<ServiceResponse<User>> {
        throw new Error("Method not implemented.");
    }
    updateUser(userId: string, dto: UpdateUserDto, performedBy?: string): Promise<ServiceResponse<void>> {
        throw new Error("Method not implemented.");
    }
    deleteUser(userId: string, performedBy?: string): Promise<ServiceResponse<void>> {
        throw new Error("Method not implemented.");
    }
    
}