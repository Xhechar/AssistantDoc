import { PrismaClient, Patient } from "@prisma/client";
import { RegisterPatientDto, UpdatePatientDto } from "../interfaces/assist.doc.dtos";
import { ServiceResponse } from "../interfaces/assist.doc.interfaces";
import { IPatientService } from "../interfaces/assists.doc.methods";
import { registerUserSchema, updatePatientSchema } from "../validators/req.body.validators";
import { FormattedResponse } from "../interfaces/helper/service.response";
import { v4 } from "uuid";


export class PatientService implements IPatientService {
    prisma = new PrismaClient({
        log: ['error']
    });

    async registerPatient(dto: RegisterPatientDto, userId: string): Promise<ServiceResponse<void>> {

        let userExists = await this.prisma.user.findUnique({
            where: {
                UserId: userId
            }
        });

        if (!userExists) {
            return FormattedResponse.failure('User not found.', 'User not found');
        }
        
        let {error} = registerUserSchema.validate(dto);

        if(error) {
            return FormattedResponse.failure(error.details[0].message, 'Validation error');
        }

        let emailExists = await this.prisma.patient.findUnique({
            where: {
                Email: dto.Email
            }
        });

        if(emailExists) {
            return FormattedResponse.failure('The email provided exists, only update.', 'Email already exists');
        }

        let phoneExists = await this.prisma.patient.findUnique({
            where: {
                Phone: dto.Phone
            }
        });

        if(phoneExists) {
            return FormattedResponse.failure('The phone number provided exists, only update.', 'Phone number already exists');
        }

        let nationalIdExists = await this.prisma.patient.findUnique({
            where: {
                NationalId: dto.NationalId
            }
        });

        if(nationalIdExists) {
            return FormattedResponse.failure('The national ID provided exists, only update.', 'National ID already exists');
        }

        let createPatient = await this.prisma.patient.create({
            data: {
                PatientId: v4(),
                CreatedByUserId: userExists.UserId,
                ...dto
            }
        });

        if(createPatient == null) {
            return FormattedResponse.failure('Patient creation failed, please try again.', 'Patient creation failed');
        } else {
            return FormattedResponse.success('Patient created successfully.');
        }

    }
    async updatePatient(patientId: string, dto: UpdatePatientDto, userId: string): Promise<ServiceResponse<void>> {
        
        let userExists = await this.prisma.user.findUnique({
            where: {
                UserId: userId
            }
        });

        if (!userExists) {
            return FormattedResponse.failure('User not found.', 'User not found');
        }

        let patientExists = await this.prisma.patient.findUnique({
            where: {
                PatientId: patientId
            }
        });

        if (!patientExists) {
            return FormattedResponse.failure('Patient not found.', 'Patient not found');
        }

        let {error} = updatePatientSchema.validate(dto);

        if(error) {
            return FormattedResponse.failure(error.details[0].message, 'Validation error');
        }

        let emailExists = await this.prisma.patient.findUnique({
            where: {
                Email: dto.Email
            }
        });

        if(emailExists) {
            return FormattedResponse.failure('The email provided exists, only update.', 'Email already exists');
        }

        let phoneExists = await this.prisma.patient.findUnique({
            where: {
                Phone: dto.Phone
            }
        });

        if(phoneExists) {
            return FormattedResponse.failure('The phone number provided exists, only update.', 'Phone number already exists');
        }

        let nationalIdExists = await this.prisma.patient.findUnique({
            where: {
                NationalId: dto.NationalId
            }
        });

        if(nationalIdExists) {
            return FormattedResponse.failure('The national ID provided exists, only update.', 'National ID already exists');
        }

        let updatePatient = await this.prisma.patient.update({
            where: {
                PatientId: patientId
            },
            data: {
                CreatedByUserId: userExists.UserId,
                ...dto
            }
        });

        if(updatePatient == null) {
            return FormattedResponse.failure('Patient update failed, please try again.', 'Patient update failed');
        } else {
            return FormattedResponse.success('Patient updated successfully.');
        }

    }
    
    async deletePatient(patientId: string): Promise<ServiceResponse<void>> {
        let patientExists = await this.prisma.patient.findUnique({
            where: {
                PatientId: patientId
            }
        });

        if (!patientExists) {
            return FormattedResponse.failure('Patient not found.', 'Patient not found');
        }

        await this.prisma.patient.delete({
            where: {
                PatientId: patientId
            }
        });

        return FormattedResponse.success('Patient deleted successfully.');
    }

    async getPatientById(patientId: string, userId: string): Promise<ServiceResponse<Patient>> {
        let userExists = await this.prisma.user.findUnique({
            where: {
                UserId: userId
            }
        });

        if (!userExists) {
            return FormattedResponse.failure('User not found.', 'User not found');
        }

        let patient = await this.prisma.patient.findUnique({
            where: {
                PatientId: patientId
            },
            include: {
                CreatedBy: true,
                Enrollments: true
            }
        });

        if (!patient) {
            return FormattedResponse.failure('Patient not found.', 'Patient not found');
        }

        return FormattedResponse.success('Patient retrieved successfully.', patient);
    }

    async getAllPatients(userId: string): Promise<ServiceResponse<Patient[]>> {
        let userExists = await this.prisma.user.findUnique({
            where: {
                UserId: userId
            }
        });

        if (!userExists) {
            return FormattedResponse.failure('Access not authorised.', 'User not found');
        }

        let patients = await this.prisma.patient.findMany({
            where: {
                CreatedByUserId: userExists.UserId
            },
            include: {
                CreatedBy: true,
                Enrollments: true
            }
        });
        
        if(!patients) {
            return FormattedResponse.failure('No patients found at the moment', 'Patients error');
        }

        return FormattedResponse.success<Patient[]>('Patients retrieved successfully', patients)
    }
}