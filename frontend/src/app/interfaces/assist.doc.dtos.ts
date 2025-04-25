//user data transfer object

export interface RegisterUserDto {
  FullName: string;
  Email: string;
  Phone: string;
  Password: string;
}

export interface LoginUserDto {
  Email: string;
  Password: string;
}

export interface UpdateUserDto {
  FullName?: string;
  Phone?: string;
  Password?: string;
  IsWelcomed?: boolean;
}

//patioent data transfer object

export interface RegisterPatientDto {
  FullName: string;
  Phone?: string;
  Email?: string;
  DateOfBirth?: Date;
  NationalId?: string;
}

export interface UpdatePatientDto {
  FullName?: string;
  Phone?: string;
  Email?: string;
  DateOfBirth?: Date;
  NationalId?: string;
}

//Enrollment data transfer object

export interface EnrollPatientDto {
  PatientId: string;
  ProgramId: string;
  EnrolledByUserId?: string;
}

export interface UpdateEnrollmentDto {
  Status?: string;
}

//Program data transfer object

export interface CreateProgramDto {
  ProgramName: string;
  Description?: string;
  CreatedByUserId?: string;
}

export interface UpdateProgramDto {
  ProgramName?: string;
  Description?: string;
}
