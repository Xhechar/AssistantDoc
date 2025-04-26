import { AfterViewInit, Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Patient, Program, Enrollment } from '../../../interfaces/assist.doc.interfaces';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent implements OnInit, AfterViewInit {
  // Stats counters
  totalPatients: number = 257;
  totalPrograms: number = 8;
  totalEnrollments: number = 423;
  totalUsers: number = 24;
  
  // Growth percentages
  patientGrowth: number = 12.5;
  programGrowth: number = 25;
  enrollmentChange: number = 4.2;
  userGrowth: number = 8.3;
  
  // Date range
  currentDateRange: string = 'Apr 1 - Apr 26, 2025';
  
  // Animation flag
  newPatientsToday: boolean = true;
  
  // Dummy data for recent patients
  recentPatients: Patient[] = [
    {
      PatientId: 'PAT-54321ab',
      FullName: 'Jane Smith',
      Phone: '+254712345678',
      Email: 'jane.smith@example.com',
      DateOfBirth: new Date('1990-05-15'),
      NationalId: 'ID12345678',
      DateCreated: new Date('2025-04-12'),
      Enrollments: [
        {
          EnrollmentId: 'ENR-111222',
          PatientId: 'PAT-54321ab',
          ProgramId: 'PRG-hiv001',
          DateCreated: new Date('2025-04-12'),
          Status: 'Active',
          EnrolledByUserId: 'USR-001'
        },
        {
          EnrollmentId: 'ENR-111223',
          PatientId: 'PAT-54321ab',
          ProgramId: 'PRG-tb001',
          DateCreated: new Date('2025-04-12'),
          Status: 'Active',
          EnrolledByUserId: 'USR-001'
        }
      ]
    },
    {
      PatientId: 'PAT-12345cd',
      FullName: 'John Doe',
      Phone: '+254723456789',
      Email: 'john.doe@example.com',
      DateOfBirth: new Date('1985-10-20'),
      NationalId: 'ID87654321',
      DateCreated: new Date('2025-04-15'),
      Enrollments: [
        {
          EnrollmentId: 'ENR-333444',
          PatientId: 'PAT-12345cd',
          ProgramId: 'PRG-diabetes',
          DateCreated: new Date('2025-04-15'),
          Status: 'Active',
          EnrolledByUserId: 'USR-001'
        }
      ]
    },
    {
      PatientId: 'PAT-67890ef',
      FullName: 'Sarah Johnson',
      Phone: '+254734567890',
      Email: 'sarah.j@example.com',
      DateOfBirth: new Date('1995-12-03'),
      NationalId: 'ID23456789',
      DateCreated: new Date('2025-04-18'),
      Enrollments: []
    },
    {
      PatientId: 'PAT-09876gh',
      FullName: 'Michael Brown',
      Phone: '+254745678901',
      Email: 'michael.b@example.com',
      DateOfBirth: new Date('1978-07-22'),
      NationalId: 'ID34567890',
      DateCreated: new Date('2025-04-20'),
      Enrollments: [
        {
          EnrollmentId: 'ENR-555666',
          PatientId: 'PAT-09876gh',
          ProgramId: 'PRG-hiv001',
          DateCreated: new Date('2025-04-20'),
          Status: 'Pending',
          EnrolledByUserId: 'USR-002'
        }
      ]
    },
    {
      PatientId: 'PAT-24680ij',
      FullName: 'Elizabeth Wilson',
      Phone: '+254756789012',
      Email: 'elizabeth.w@example.com',
      DateOfBirth: new Date('1992-04-17'),
      NationalId: 'ID45678901',
      DateCreated: new Date('2025-04-24'),
      Enrollments: [
        {
          EnrollmentId: 'ENR-777888',
          PatientId: 'PAT-24680ij',
          ProgramId: 'PRG-malaria',
          DateCreated: new Date('2025-04-24'),
          Status: 'Active',
          EnrolledByUserId: 'USR-001'
        },
        {
          EnrollmentId: 'ENR-777889',
          PatientId: 'PAT-24680ij',
          ProgramId: 'PRG-nutrition',
          DateCreated: new Date('2025-04-25'),
          Status: 'Active',
          EnrolledByUserId: 'USR-003'
        }
      ]
    }
  ];
  
  // Dummy data for active programs
  activePrograms: Program[] = [
    {
      ProgramId: 'PRG-hiv001',
      ProgramName: 'HIV/AIDS Treatment',
      Description: 'Comprehensive program for HIV/AIDS patients including ARV therapy and regular checkups.',
      DateCreated: new Date('2024-12-10'),
      DateModified: new Date('2025-03-15'),
      CreatedByUserId: 'USR-001',
      Enrollments: Array(56).fill(null)
    },
    {
      ProgramId: 'PRG-tb001',
      ProgramName: 'Tuberculosis Control',
      Description: 'TB diagnosis, treatment, and follow-up program for affected patients.',
      DateCreated: new Date('2025-01-05'),
      DateModified: new Date('2025-03-20'),
      CreatedByUserId: 'USR-002',
      Enrollments: Array(42).fill(null)
    },
    {
      ProgramId: 'PRG-malaria',
      ProgramName: 'Malaria Prevention',
      Description: 'Prevention, diagnosis and treatment of malaria with follow-up care.',
      DateCreated: new Date('2025-02-15'),
      DateModified: new Date('2025-04-01'),
      CreatedByUserId: 'USR-001',
      Enrollments: Array(78).fill(null)
    },
    {
      ProgramId: 'PRG-diabetes',
      ProgramName: 'Diabetes Management',
      Description: 'Program for diabetes diagnosis, treatment, and lifestyle management.',
      DateCreated: new Date('2025-03-10'),
      DateModified: new Date('2025-04-10'),
      CreatedByUserId: 'USR-003',
      Enrollments: Array(31).fill(null)
    }
  ];
  
  // Dummy data for recent enrollments with populated objects
  recentEnrollments: Enrollment[] = [
    {
      EnrollmentId: 'ENR-777888',
      PatientId: 'PAT-24680ij',
      ProgramId: 'PRG-malaria',
      EnrolledByUserId: 'USR-001',
      DateCreated: new Date('2025-04-24'),
      Status: 'Active',
      Patient: {
        PatientId: 'PAT-24680ij',
        FullName: 'Elizabeth Wilson',
        Phone: '+254756789012',
        Email: 'elizabeth.w@example.com',
        DateOfBirth: new Date('1992-04-17'),
        NationalId: 'ID45678901',
        DateCreated: new Date('2025-04-24')
      },
      Program: {
        ProgramId: 'PRG-malaria',
        ProgramName: 'Malaria Prevention',
        Description: 'Prevention, diagnosis and treatment of malaria with follow-up care.',
        DateCreated: new Date('2025-02-15'),
        DateModified: new Date('2025-04-01')
      },
      EnrolledBy: {
        UserId: 'USR-001',
        FullName: 'Dr. James Wilson',
        Email: 'james.wilson@assistantdoc.com',
        Phone: '+254700123456',
        Password: '',
        Role: 'Doctor',
        IsWelcomed: true,
        DateCreated: new Date('2024-10-15')
      }
    },
    {
      EnrollmentId: 'ENR-777889',
      PatientId: 'PAT-24680ij',
      ProgramId: 'PRG-nutrition',
      EnrolledByUserId: 'USR-003',
      DateCreated: new Date('2025-04-25'),
      Status: 'Active',
      Patient: {
        PatientId: 'PAT-24680ij',
        FullName: 'Elizabeth Wilson',
        Phone: '+254756789012',
        Email: 'elizabeth.w@example.com',
        DateOfBirth: new Date('1992-04-17'),
        NationalId: 'ID45678901',
        DateCreated: new Date('2025-04-24')
      },
      Program: {
        ProgramId: 'PRG-nutrition',
        ProgramName: 'Nutrition Support',
        Description: 'Program for addressing malnutrition and dietary guidance.',
        DateCreated: new Date('2025-01-20'),
        DateModified: new Date('2025-03-12')
      },
      EnrolledBy: {
        UserId: 'USR-003',
        FullName: 'Dr. Sarah Johnson',
        Email: 'sarah.johnson@assistantdoc.com',
        Phone: '+254711234567',
        Password: '',
        Role: 'Nutritionist',
        IsWelcomed: true,
        DateCreated: new Date('2024-11-05')
      }
    },
    {
      EnrollmentId: 'ENR-555666',
      PatientId: 'PAT-09876gh',
      ProgramId: 'PRG-hiv001',
      EnrolledByUserId: 'USR-002',
      DateCreated: new Date('2025-04-20'),
      Status: 'Pending',
      Patient: {
        PatientId: 'PAT-09876gh',
        FullName: 'Michael Brown',
        Phone: '+254745678901',
        Email: 'michael.b@example.com',
        DateOfBirth: new Date('1978-07-22'),
        NationalId: 'ID34567890',
        DateCreated: new Date('2025-04-20')
      },
      Program: {
        ProgramId: 'PRG-hiv001',
        ProgramName: 'HIV/AIDS Treatment',
        Description: 'Comprehensive program for HIV/AIDS patients including ARV therapy and regular checkups.',
        DateCreated: new Date('2024-12-10'),
        DateModified: new Date('2025-03-15')
      },
      EnrolledBy: {
        UserId: 'USR-002',
        FullName: 'Dr. Emily Parker',
        Email: 'emily.parker@assistantdoc.com',
        Phone: '+254722345678',
        Password: '',
        Role: 'Doctor',
        IsWelcomed: true,
        DateCreated: new Date('2024-10-25')
      }
    },
    {
      EnrollmentId: 'ENR-333444',
      PatientId: 'PAT-12345cd',
      ProgramId: 'PRG-diabetes',
      EnrolledByUserId: 'USR-001',
      DateCreated: new Date('2025-04-15'),
      Status: 'Active',
      Patient: {
        PatientId: 'PAT-12345cd',
        FullName: 'John Doe',
        Phone: '+254723456789',
        Email: 'john.doe@example.com',
        DateOfBirth: new Date('1985-10-20'),
        NationalId: 'ID87654321',
        DateCreated: new Date('2025-04-15')
      },
      Program: {
        ProgramId: 'PRG-diabetes',
        ProgramName: 'Diabetes Management',
        Description: 'Program for diabetes diagnosis, treatment, and lifestyle management.',
        DateCreated: new Date('2025-03-10'),
        DateModified: new Date('2025-04-10')
      },
      EnrolledBy: {
        UserId: 'USR-001',
        FullName: 'Dr. James Wilson',
        Email: 'james.wilson@assistantdoc.com',
        Phone: '+254700123456',
        Password: '',
        Role: 'Doctor',
        IsWelcomed: true,
        DateCreated: new Date('2024-10-15')
      }
    }
  ];

  constructor(private router: Router) {}

  ngOnInit(): void {
    // Any initialization code
  }

  ngAfterViewInit(): void {
    //
  }
  // Get patient age from date of birth
  getPatientAge(dob?: Date): number {
    if (!dob) return 0;
    
    const today = new Date();
    const birthDate = new Date(dob);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    
    return age;
  }

  // Get appropriate text for enrollment count
  getEnrollmentText(count?: number): string {
    if (!count) return 'No programs';
    return count === 1 ? 'program' : 'programs';
  }

  // Search patients
  searchPatients(event: Event): void {
    const searchTerm = (event.target as HTMLInputElement).value.toLowerCase();
    // Implement search logic here
    console.log('Searching for:', searchTerm);
  }

  // View patient details
  viewPatientDetails(patientId: string): void {
    this.router.navigate(['/clients/view', patientId]);
  }

  // Enroll patient in a program
  enrollPatient(patientId: string): void {
    this.router.navigate(['/enrollments/create'], { 
      queryParams: { patientId: patientId }
    });
  }

  // View program details
  viewProgramDetails(programId: string): void {
    this.router.navigate(['/programs/view', programId]);
  }
}
