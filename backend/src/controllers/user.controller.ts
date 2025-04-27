import { ExtendedRequest } from "../interfaces/assist.doc.interfaces";
import { UserService } from "../services/user.service";
import { Request, Response } from "express";
import { FormattedResponse } from "../interfaces/helper/service.response";
import { getIdFromToken } from "../middlewares/verify.tokens";

let userService = new UserService();

export class UserController {
    async registerUser(req: Request, res: Response) {
        try {
            let result = await userService.registerUser(req.body);

            res.status(200).json(result);
        } catch (error) {
            const message = error instanceof Error ? error.message : 'Unknown server error';
            res.status(500).json(FormattedResponse.failure(message, 'Server Error'));
        }
    }

    async loginUser(req: Request, res: Response) {
        try {
            let result = await userService.loginUser(req.body);

            if (result.success) {
                res.cookie('token', result.token as string, {
                    httpOnly: true,
                    secure: false,
                    sameSite: 'strict',
                    maxAge: 45 * 60 * 1000,
                    signed: true
                });

                let { token, ...rest } = result;
                return res.status(200).json(rest);
            }

            return res.status(400).json(result);
        } catch (error) {
            const message = error instanceof Error ? error.message : 'Unknown server error';
            return res.status(500).json(FormattedResponse.failure(message, 'Server Error'));
        }
    }

    async logoutUser(req: Request, res: Response) {
        try {
            res.clearCookie('token', { signed: true });

            return res.status(200).json(FormattedResponse.success('Logout successful, you are always welcomed'));
        } catch (error) {
            const message = error instanceof Error ? error.message : 'Unknown server error';
            return res.status(500).json(FormattedResponse.failure(message, 'Server Error'));
        }
    }

    async getUserById(req: ExtendedRequest, res: Response) {
        try {

            let result = await userService.getUserById(getIdFromToken(req));

            if (result.success) {
                return res.status(200).json(result);
            }

            return res.status(404).json(result);
        } catch (error) {
            const message = error instanceof Error ? error.message : 'Unknown server error';
            return res.status(500).json(FormattedResponse.failure(message, 'Server Error'));
        }
    }

    async updateUser(req: ExtendedRequest, res: Response) {
        try {

            let result = await userService.updateUser(getIdFromToken(req), req.body);

            if (result.success) {
                return res.status(200).json(result);
            }

            return res.status(400).json(result);
        } catch (error) {
            const message = error instanceof Error ? error.message : 'Unknown server error';
            return res.status(500).json(FormattedResponse.failure(message, 'Server Error'));
        }
    }

    async deleteUser(req: Request, res: Response) {
        try {
            const { userId } = req.params;

            let result = await userService.deleteUser(userId);

            if (result.success) {
                return res.status(200).json(result);
            }

            return res.status(400).json(result);
        } catch (error) {
            const message = error instanceof Error ? error.message : 'Unknown server error';
            return res.status(500).json(FormattedResponse.failure(message, 'Server Error'));
        }
    }
}
