export interface Program {
  ProgramId: string;
  ProgramName: string;
  Description?: string;
  DateCreated: Date;
  DateModified: Date;
  CreatedByUserId?: string;
  CreatedBy?: User;
  Enrollments?: Enrollment[];
}

export interface User {
  UserId: string;
  FullName: string;
  Email: string;
  Phone: string;
  Password: string;
  Role?: string;
  IsWelcomed: boolean;
  DateCreated: Date;
  ProgramsCreated?: Program[];
  Enrollments?: Enrollment[];
}

export interface Patient {
  PatientId: string;
  FullName: string;
  Phone?: string;
  Email?: string;
  DateOfBirth?: Date;
  NationalId?: string;
  DateCreated: Date;
  Enrollments?: Enrollment[];
}

export interface Enrollment {
  EnrollmentId: string;
  PatientId: string;
  ProgramId: string;
  EnrolledByUserId?: string;
  DateCreated: Date;
  Status: string;
  Patient?: Patient;
  Program?: Program;
  EnrolledBy?: User;
}

// service result interface
export interface ServiceResponse<T> {
  success: boolean;
  message: string;
  error?: string | null;
  object?: T | null;
  objects?: T[] | null;
  token?: string | null;
  role?: string | null;
}