import { CreateProgramDto, EnrollPatientDto, LoginUserDto, RegisterPatientDto, RegisterUserDto, UpdateEnrollmentDto, UpdatePatientDto, UpdateProgramDto, UpdateUserDto } from "./assist.doc.dtos";
import { Enrollment, Patient, Program, ServiceResponse, User } from "./assist.doc.interfaces";
import { EnrollmentStatus } from "./enums/enrollment.enum";


//user methods interface

export interface IProgramService {
  createProgram(dto: CreateProgramDto, userId: string): Promise<ServiceResponse<void>>;
  updateProgram(programId: string, dto: UpdateProgramDto, userId: string): Promise<ServiceResponse<void>>;
  deleteProgram(programId: string): Promise<ServiceResponse<void>>;
  getProgramById(programId: string, userId: string): Promise<ServiceResponse<Program>>;
  getAllPrograms(userId: string): Promise<ServiceResponse<Program>>;
}

//patient methods interface

export interface IPatientService {
  registerPatient(dto: RegisterPatientDto, userId: string): Promise<ServiceResponse<void>>;
  updatePatient(patientId: string, dto: UpdatePatientDto, userId: string): Promise<ServiceResponse<void>>;
  deletePatient(patientId: string): Promise<ServiceResponse<void>>;
  getPatientById(patientId: string, userId: string): Promise<ServiceResponse<Patient>>;
  searchPatients(query: string, userId: string): Promise<ServiceResponse<Patient>>;
  getAllPatients(userId: string): Promise<ServiceResponse<Patient>>;
}

// Enrollment methods interface

export interface IEnrollmentService {
  enrollPatient(dto: EnrollPatientDto, userId: string): Promise<ServiceResponse<void>>;
  updateEnrollment(enrollmentId: string, dto: UpdateEnrollmentDto, userId: string): Promise<ServiceResponse<void>>;
  updateEnrollmentStatus(id: string, status: EnrollmentStatus, userId: string): Promise<ServiceResponse<null>>;
  deleteEnrollment(enrollmentId: string): Promise<ServiceResponse<void>>;
  getEnrollmentById(enrollmentId: string, userId: string): Promise<ServiceResponse<Enrollment>>;
  getPatientEnrollments(patientId: string, userId: string): Promise<ServiceResponse<Enrollment>>;
}

// user methods interface
export interface IUserService {
  registerUser(dto: RegisterUserDto): Promise<ServiceResponse<void>>;
  loginUser(dto: LoginUserDto): Promise<ServiceResponse<User>>;
  getUserById(userId: string): Promise<ServiceResponse<User>>;
  updateUser(userId: string, dto: UpdateUserDto, performedBy?: string): Promise<ServiceResponse<void>>;
  deleteUser(userId: string, performedBy?: string): Promise<ServiceResponse<void>>;
}