import { PrismaClient, User } from "@prisma/client";
import { RegisterUserDto, LoginUserDto, UpdateUserDto } from "../interfaces/assist.doc.dtos";
import { ServiceResponse } from "../interfaces/assist.doc.interfaces";
import { IUserService } from "../interfaces/assists.doc.methods";
import { FormattedResponse } from "../interfaces/helper/service.response";
import { v4 } from "uuid";
import bcrypt from "bcrypt";
import { loginUserSchema, registerUserSchema } from "../validators/req.body.validators";
import jwt from "jsonwebtoken";
import dotenv from 'dotenv';

dotenv.config();


export class UserService implements IUserService {
    prisma = new PrismaClient({
        log: ['error'],

    });

    async registerUser(dto: RegisterUserDto): Promise<ServiceResponse<void>> {

        let {error} = registerUserSchema.validate(dto);

        if (error) {
            return FormattedResponse.failure(error.details[0].message, 'Validation error');
        }

        let emailExists = await this.prisma.user.findUnique({
            where: {
                Email: dto.Email
            }
        });

        if (emailExists) {
            return FormattedResponse.failure('The email provided exists, Login instead.', 'Email already exists');
        }

        let phoneExists = await this.prisma.user.findUnique({
            where: {
                Phone: dto.Phone
            }
        });

        if (phoneExists) {
            return FormattedResponse.failure('The phone number provided exists, Login instead.', 'Phone number already exists');
        }

        let {Password, ...rest} = dto;

        let createUser = await this.prisma.user.create({
        data: {
            UserId: v4(),
            Password: bcrypt.hashSync(dto.Password, 10),
            ...rest,
        }
        });

        if (createUser == null) {
            return FormattedResponse.failure('Account creation failed, please try again.', 'Account creation failed');
        } else {
            return FormattedResponse.success('Account created successfully, please login.');
        }
    }
    async loginUser(dto: LoginUserDto): Promise<ServiceResponse<User>> {

        let {error} = loginUserSchema.validate(dto);

        if (error) {
            return FormattedResponse.failure(error.details[0].message, 'Validation error');
        }

        let userExists = await this.prisma.user.findUnique({
            where: {
                Email: dto.Email
            }
        });

        if (!userExists) {
            return FormattedResponse.failure('Email not found. Please register first.', 'User not found');
        }

        let passwordMatches = bcrypt.compareSync(dto.Password, userExists.Password);

        if (!passwordMatches) {
            return FormattedResponse.failure('Incorrect password provided.', 'Invalid credentials');
        }

        let { Password, FullName, Email, Phone, IsWelcomed, DateCreated, ...rest } = userExists;

        let token = jwt.sign({ ...rest }, process.env.JWT_SECRET as string, {
            expiresIn: '15m'
        });

        return FormattedResponse.auth(token, userExists.Role as string);
    }
    async getUserById(userId: string): Promise<ServiceResponse<User>> {
        let userExists = await this.prisma.user.findUnique({
            where: {
                UserId: userId
            },
            include: {
                ProgramsCreated: true,
                Enrollments: true
            }
        });

        if (!userExists) {
            return FormattedResponse.failure('User not found.', 'User not found');
        }

        return FormattedResponse.success<User>('User found.', userExists);
    }
    async updateUser(userId: string, dto: UpdateUserDto): Promise<ServiceResponse<void>> {
        let {error} = registerUserSchema.validate(dto);

        if (error) {
            return FormattedResponse.failure(error.details[0].message, 'Validation error');
        }

        let userExists = await this.prisma.user.findUnique({
            where: {
                UserId: userId
            }
        });

        if (!userExists) {
            return FormattedResponse.failure('User not found.', 'User not found');
        }

        let updateUser = await this.prisma.user.update({
            where: {
                UserId: userId
            },
            data: {
                ...dto
            }
        });

        if (updateUser == null) {
            return FormattedResponse.failure('User update failed, please try again.', 'User update failed');
        } else {
            return FormattedResponse.success('User updated successfully.');
        }
    }
    async deleteUser(userId: string): Promise<ServiceResponse<void>> {

        let userExists = await this.prisma.user.findUnique({
            where: {
                UserId: userId
            }
        });

        if (!userExists) {
            return FormattedResponse.failure('User not found.', 'User not found');
        }

        let deleteUser = await this.prisma.user.delete({
            where: {
                UserId: userId
            }
        });

        if (deleteUser == null) {
            return FormattedResponse.failure('User deletion failed, please try again.', 'User deletion failed');
        } else {
            return FormattedResponse.success('User deleted successfully.');
        }
    }
}