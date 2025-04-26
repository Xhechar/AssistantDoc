import { Request, Response } from "express";
import { FormattedResponse } from "../interfaces/helper/service.response";
import { EnrollmentService } from "../services/enrollment.service";
import { EnrollPatientDto } from "../interfaces/assist.doc.dtos";
import { getIdFromToken } from "../middlewares/verify.tokens";
import { ExtendedRequest } from "../interfaces/assist.doc.interfaces";

const enrollmentService = new EnrollmentService();

export class EnrollmentController {
    async enrollPatient(req: ExtendedRequest, res: Response) {
        try {
            let newDto: EnrollPatientDto = {
                ... req.body,
                EnrolledByUserId: getIdFromToken(req)
            }

            const result = await enrollmentService.enrollPatient(newDto);
            if (result.success) {
                return res.status(200).json(result);
            }
            return res.status(400).json(result);
        } catch (error) {
            return res.status(500).json(FormattedResponse.failure(error as string, "Something went wrong"));
        }
    }

    async toggleEnrollmentStatus(req: Request, res: Response) {
        try {
            const result = await enrollmentService.toggleEnrollmentStatus(req.params.enrollmentId);
            if (result.success) {
                return res.status(200).json(result);
            }
            return res.status(400).json(result);
        } catch (error) {
            return res.status(500).json(FormattedResponse.failure(error as string, "Something went wrong"));
        }
    }

    async deleteEnrollment(req: Request, res: Response) {
        try {
            const result = await enrollmentService.deleteEnrollment(req.params.enrollmentId);
            if (result.success) {
                return res.status(200).json(result);
            }
            return res.status(400).json(result);
        } catch (error) {
            return res.status(500).json(FormattedResponse.failure(error as string, "Something went wrong"));
        }
    }

    async getEnrollmentById(req: Request, res: Response) {
        try {
            const result = await enrollmentService.getEnrollmentById(req.params.enrollmentId);
            if (result.success) {
                return res.status(200).json(result);
            }
            return res.status(400).json(result);
        } catch (error) {
            return res.status(500).json(FormattedResponse.failure(error as string, "Something went wrong"));
        }
    }

    async getAllEnrollments(req: ExtendedRequest, res: Response) {
        try {
            const result = await enrollmentService.getAllEnrollments(getIdFromToken(req));
            if (result.success) {
                return res.status(200).json(result);
            }
            return res.status(400).json(result);
        } catch (error) {
            return res.status(500).json(FormattedResponse.failure(error as string, "Something went wrong"));
        }
    }
}
