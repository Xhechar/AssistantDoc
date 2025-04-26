import { PrismaClient, Program } from "@prisma/client";
import { CreateProgramDto, UpdateProgramDto } from "../interfaces/assist.doc.dtos";
import { ServiceResponse } from "../interfaces/assist.doc.interfaces";
import { IProgramService } from "../interfaces/assists.doc.methods";
import { FormattedResponse } from "../interfaces/helper/service.response";
import { v4 } from "uuid";
import { createProgramSchema } from "../validators/req.body.validators";

export class ProgramService implements IProgramService {
    prisma = new PrismaClient({
        log: ['error']
    });

    async createProgram(dto: CreateProgramDto, userId: string): Promise<ServiceResponse<void>> {
        let userExists = await this.prisma.user.findUnique({
            where: {
                UserId: userId
            }
        });

        if (!userExists) {
            return FormattedResponse.failure('Access not authorised.', 'User not found');
        }

        let {error} = createProgramSchema.validate(dto);

        if (error) {
            return FormattedResponse.failure(error.message, 'Invalid Input Error');
        }

        let createProgram = await this.prisma.program.create({
            data: {
                ProgramId: v4(),
                ...dto,
                CreatedByUserId: userExists.UserId
            }
        });

        if (!createProgram) {
            return FormattedResponse.failure('Unable to create program', 'Program Error');
        }

        return FormattedResponse.success('Program created successfully.');
    }

    async updateProgram(programId: string, dto: UpdateProgramDto, userId: string): Promise<ServiceResponse<void>> {
        let userExists = await this.prisma.user.findUnique({
            where: {
                UserId: userId
            }
        });

        if (!userExists) {
            return FormattedResponse.failure('Access not authorised.', 'User not found');
        }

        let programExists = await this.prisma.program.findUnique({
            where: {
                ProgramId: programId
            }
        });

        if (!programExists) {
            return FormattedResponse.failure('Program not found.', 'Program not found');
        }

        let {error} = createProgramSchema.validate(dto);

        if (error) {
            return FormattedResponse.failure(error.message, 'Invalid Input Error');
        }

        let update = await this.prisma.program.update({
            where: {
                ProgramId: programId
            },
            data: {
                ...dto
            }
        });

        if(!update) {
            FormattedResponse.failure('Unable to update program', 'Program Error');
        }

        return FormattedResponse.success('Program updated successfully.');
    }

    async deleteProgram(programId: string): Promise<ServiceResponse<void>> {
        let programExists = await this.prisma.program.findUnique({
            where: {
                ProgramId: programId
            }
        });

        if (!programExists) {
            return FormattedResponse.failure('Program not found.', 'Program not found');
        }


        let _delete = await this.prisma.program.delete({
            where: {
                ProgramId: programId
            }
        });

        if(!_delete) {
            FormattedResponse.failure('Unable to update program', 'Program Error');
        }

        return FormattedResponse.success('Program deleted successfully.');
    }

    async getProgramById(programId: string): Promise<ServiceResponse<Program>> {

        let program = await this.prisma.program.findUnique({
            where: {
                ProgramId: programId
            },
            include: {
                CreatedBy: true,
                Enrollments: true
            }
        });

        if (!program) {
            return FormattedResponse.failure('Program not found.', 'Program not found');
        }

        return FormattedResponse.success('Program retrieved successfully.', program);
    }

    async getAllPrograms(userId: string): Promise<ServiceResponse<Program[]>> {
        let userExists = await this.prisma.user.findUnique({
            where: {
                UserId: userId
            },
            include: {
                Enrollments: true
            }
        });

        if (!userExists) {
            return FormattedResponse.failure('Access not authorised.', 'User not found');
        }

        let programs = await this.prisma.program.findMany({
            where: {
                CreatedByUserId: userId
            }
        });

        if (!programs || programs.length === 0) {
            return FormattedResponse.failure('No programs found.', 'Programs not found');
        }

        return FormattedResponse.success('Programs retrieved successfully.', programs);
    }
}
