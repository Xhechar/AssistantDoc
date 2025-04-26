import { Request, Response } from "express";
import { FormattedResponse } from "../interfaces/helper/service.response";
import { ProgramService } from "../services/program.service";
import { CreateProgramDto, UpdateProgramDto } from "../interfaces/assist.doc.dtos";
import { ExtendedRequest } from "../interfaces/assist.doc.interfaces";
import { getIdFromToken } from "../middlewares/verify.tokens";

const programService = new ProgramService();

export class ProgramController {
    async createProgram(req: ExtendedRequest, res: Response) {
        try {
            const result = await programService.createProgram(req.body as CreateProgramDto, getIdFromToken(req));
            if (result.success) {
                return res.status(200).json(result);
            }
            return res.status(400).json(result);
        } catch (error) {
            return res.status(500).json(FormattedResponse.failure(error as string, "Server Error"));
        }
    }

    async updateProgram(req: ExtendedRequest, res: Response) {
        try {
            const result = await programService.updateProgram(req.params.programId, req.body as UpdateProgramDto, getIdFromToken(req));
            if (result.success) {
                return res.status(200).json(result);
            }
            return res.status(400).json(result);
        } catch (error) {
            return res.status(500).json(FormattedResponse.failure(error as string, "Server Error"));
        }
    }

    async deleteProgram(req: Request, res: Response) {
        try {
            const result = await programService.deleteProgram(req.params.programId);
            if (result.success) {
                return res.status(200).json(result);
            }
            return res.status(400).json(result);
        } catch (error) {
            return res.status(500).json(FormattedResponse.failure(error as string, "Server Error"));
        }
    }

    async getProgramById(req: Request, res: Response) {
        try {
            const result = await programService.getProgramById(req.params.programId);
            if (result.success) {
                return res.status(200).json(result);
            }
            return res.status(400).json(result);
        } catch (error) {
            return res.status(500).json(FormattedResponse.failure(error as string, "Server Error"));
        }
    }

    async getAllPrograms(req: ExtendedRequest, res: Response) {
        try {
            const result = await programService.getAllPrograms(getIdFromToken(req));
            if (result.success) {
                return res.status(200).json(result);
            }
            return res.status(400).json(result);
        } catch (error) {
            return res.status(500).json(FormattedResponse.failure(error as string, "Server Error"));
        }
    }
}
