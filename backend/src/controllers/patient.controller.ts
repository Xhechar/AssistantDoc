import { Request, Response } from "express";
import { FormattedResponse } from "../interfaces/helper/service.response";
import { PatientService } from "../services/patient.service";
import { RegisterPatientDto, UpdatePatientDto } from "../interfaces/assist.doc.dtos";
import { getIdFromToken } from "../middlewares/verify.tokens";
import { ExtendedRequest } from "../interfaces/assist.doc.interfaces";

const patientService = new PatientService();

export class PatientController {
    async registerPatient(req: ExtendedRequest, res: Response) {
        try {
            const result = await patientService.registerPatient(req.body as RegisterPatientDto, getIdFromToken(req));
            if (result.success) {
                return res.status(200).json(result);
            }
            return res.status(400).json(result);
        } catch (error) {
            return res.status(500).json(FormattedResponse.failure(error as string, "Server Error"));
        }
    }

    async updatePatient(req: ExtendedRequest, res: Response) {
        try {
            const result = await patientService.updatePatient(req.params.patientId, req.body as UpdatePatientDto, getIdFromToken(req));
            if (result.success) {
                return res.status(200).json(result);
            }
            return res.status(400).json(result);
        } catch (error) {
            return res.status(500).json(FormattedResponse.failure(error as string, "Server Error"));
        }
    }

    async deletePatient(req: Request, res: Response) {
        try {
            const result = await patientService.deletePatient(req.params.patientId);
            if (result.success) {
                return res.status(200).json(result);
            }
            return res.status(400).json(result);
        } catch (error) {
            return res.status(500).json(FormattedResponse.failure(error as string, "Server Error"));
        }
    }

    async getPatientById(req: Request, res: Response) {
        try {
            const result = await patientService.getPatientById(req.params.patientId);
            if (result.success) {
                return res.status(200).json(result);
            }
            return res.status(400).json(result);
        } catch (error) {
            return res.status(500).json(FormattedResponse.failure(error as string, "Server Error"));
        }
    }

    async getAllPatients(req: ExtendedRequest, res: Response) {
        try {
            const result = await patientService.getAllPatients(getIdFromToken(req));
            if (result.success) {
                return res.status(200).json(result);
            }
            return res.status(400).json(result);
        } catch (error) {
            return res.status(500).json(FormattedResponse.failure(error as string, "Server Error"));
        }
    }
}
