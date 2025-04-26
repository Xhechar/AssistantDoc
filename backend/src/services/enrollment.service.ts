import { PrismaClient, Enrollment } from "@prisma/client";
import { EnrollPatientDto, UpdateEnrollmentDto } from "../interfaces/assist.doc.dtos";
import { ServiceResponse } from "../interfaces/assist.doc.interfaces";
import { IEnrollmentService } from "../interfaces/assists.doc.methods";
import { EnrollmentStatus } from "../interfaces/enums/enrollment.enum";
import { FormattedResponse } from "../interfaces/helper/service.response";
import { v4 } from "uuid";

export class EnrollmentService implements IEnrollmentService {
    prisma = new PrismaClient({
        log: ['error']
    });

    async enrollPatient(dto: EnrollPatientDto): Promise<ServiceResponse<void>> {
        let patientExists = await this.prisma.patient.findUnique({
            where: { PatientId: dto.PatientId }
        });

        if (!patientExists) {
            return FormattedResponse.failure('patient not found.', 'Patient Erro');
        }

        let programExists = await this.prisma.program.findUnique({
            where: { ProgramId: dto.ProgramId }
        });

        if (!programExists) {
            return FormattedResponse.failure('program not found.', 'Program Erro');
        }

        const createEnrollment = await this.prisma.enrollment.create({
            data: {
                EnrollmentId: v4(),
                PatientId: patientExists.PatientId,
                ProgramId: programExists.ProgramId,
                EnrolledByUserId: dto.EnrolledByUserId
            }
        });

        if (!createEnrollment) {
            return FormattedResponse.failure('Enrollment creation failed.', 'Enrollment Error');
        }

        return FormattedResponse.success('Patient enrolled successfully.');
    }

    async toggleEnrollmentStatus(id: string): Promise<ServiceResponse<null>> {
        let enrollmentExists = await this.prisma.enrollment.findUnique({
            where: { EnrollmentId: id }
        });

        if (!enrollmentExists) {
            return FormattedResponse.failure('Enrollment not found.', 'Enrollment not found');
        }

        let updateStatus: EnrollmentStatus = enrollmentExists.Status === EnrollmentStatus.Completed ? EnrollmentStatus.Pending : EnrollmentStatus.Completed;

        let update = await this.prisma.enrollment.update({
            where: { EnrollmentId: enrollmentExists.EnrollmentId },
            data: { Status: updateStatus }
        });

        if (!update) {
            return FormattedResponse.failure('Unable to update enrollment status', 'Enrollment Error');
        }

        return FormattedResponse.success('Enrollment status updated successfully.');
    }

    async deleteEnrollment(enrollmentId: string): Promise<ServiceResponse<void>> {
        let enrollmentExists = await this.prisma.enrollment.findUnique({
            where: { EnrollmentId: enrollmentId }
        });

        if (!enrollmentExists) {
            return FormattedResponse.failure('Enrollment not found.', 'Enrollment Error');
        }

        let _delete = await this.prisma.enrollment.delete({
            where: { EnrollmentId: enrollmentId }
        });

        if(!_delete) {
            return FormattedResponse.failure('Unable to delete enrollment.', 'Enrollment Error');
        }

        return FormattedResponse.success('Enrollment deleted successfully.');
    }

    async getEnrollmentById(enrollmentId: string): Promise<ServiceResponse<Enrollment>> {
        let enrollment = await this.prisma.enrollment.findUnique({
            where: { EnrollmentId: enrollmentId },
            include: {
                Patient: true,
                EnrolledBy: true,
                Program: true
            }
        });

        if (!enrollment) {
            return FormattedResponse.failure('Enrollment not found.', 'Enrollment Error');
        }

        return FormattedResponse.success('Enrollment retrieved successfully.', enrollment);
    }

    async getAllEnrollments(userId: string): Promise<ServiceResponse<Enrollment[]>> {

        let userExists = await this.prisma.user.findUnique({
            where: {
                UserId: userId
            }
        });

        if (!userExists) {
            return FormattedResponse.failure('Access not authorised.', 'User not found');
        }

        let enrollmentsExist = await this.prisma.enrollment.findMany({
            where: { EnrolledByUserId: userExists.UserId }
        });

        if (!enrollmentsExist) {
            return FormattedResponse.failure('Patient not found.', 'Patient not found');
        }

        let enrollments = await this.prisma.enrollment.findMany({
            where: { EnrolledByUserId: userExists.UserId },
            include: {
                Patient: true,
                EnrolledBy: true,
                Program: true
            }
        });

        if (!enrollments || enrollments.length === 0) {
            return FormattedResponse.failure('No enrollments found for this patient.', 'Enrollments Error');
        }

        return FormattedResponse.success<Enrollment[]>('Patient enrollments retrieved successfully.', enrollments);
    }
}
