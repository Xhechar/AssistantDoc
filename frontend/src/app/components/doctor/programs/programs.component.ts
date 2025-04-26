import { Component, OnInit } from '@angular/core';
import { Program, Patient, User, Enrollment } from '../../../interfaces/assist.doc.interfaces';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-programs',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './programs.component.html',
  styleUrl: './programs.component.css'
})
export class ProgramsComponent implements OnInit {
  // Programs data
  programs: Program[] = [];
  filteredPrograms: Program[] = [];
  searchTerm: string = '';

  // Modal states
  showProgramForm: boolean = false;
  showDeleteModal: boolean = false;
  showEnrollModal: boolean = false;
  isEditMode: boolean = false;

  // Current program for operations
  currentProgram: Program = this.getEmptyProgram();
  programToDelete: Program | null = null;
  programToEnroll: Program | null = null;

  // Patients data
  patients: Patient[] = [];
  filteredPatients: Patient[] = [];
  selectedPatients: Patient[] = [];
  patientSearchTerm: string = '';

  constructor() { }

  ngOnInit(): void {
    this.loadDummyData();
    this.filteredPrograms = [...this.programs];
  }

  // Load dummy data for demonstration
  loadDummyData(): void {
    // Dummy users
    const users: User[] = [
      {
        UserId: 'user-1',
        FullName: 'John Doe',
        Email: 'john@example.com',
        Phone: '+1234567890',
        Password: 'password',
        Role: 'Admin',
        IsWelcomed: true,
        DateCreated: new Date('2023-01-10')
      },
      {
        UserId: 'user-2',
        FullName: 'Jane Smith',
        Email: 'jane@example.com',
        Phone: '+1987654321',
        Password: 'password',
        Role: 'Doctor',
        IsWelcomed: true,
        DateCreated: new Date('2023-02-15')
      }
    ];

    // Dummy patients
    this.patients = [
      {
        PatientId: 'patient-1',
        FullName: 'Alice Johnson',
        Phone: '+1122334455',
        Email: 'alice@example.com',
        DateOfBirth: new Date('1985-05-15'),
        NationalId: 'NAT123456',
        DateCreated: new Date('2023-03-01')
      },
      {
        PatientId: 'patient-2',
        FullName: 'Bob Williams',
        Phone: '+1567890123',
        Email: 'bob@example.com',
        DateOfBirth: new Date('1992-08-23'),
        NationalId: 'NAT789012',
        DateCreated: new Date('2023-03-05')
      },
      {
        PatientId: 'patient-3',
        FullName: 'Carol Davis',
        Phone: '+1345678901',
        Email: 'carol@example.com',
        DateOfBirth: new Date('1978-12-10'),
        NationalId: 'NAT345678',
        DateCreated: new Date('2023-03-10')
      },
      {
        PatientId: 'patient-4',
        FullName: 'David Miller',
        Phone: '+1890123456',
        Email: 'david@example.com',
        DateOfBirth: new Date('1990-04-05'),
        NationalId: 'NAT901234',
        DateCreated: new Date('2023-03-15')
      }
    ];

    // Dummy enrollments
    const enrollments: Enrollment[] = [
      {
        EnrollmentId: 'enroll-1',
        PatientId: 'patient-1',
        ProgramId: 'program-1',
        EnrolledByUserId: 'user-1',
        DateCreated: new Date('2023-04-05'),
        Status: 'Active',
        Patient: this.patients[0]
      },
      {
        EnrollmentId: 'enroll-2',
        PatientId: 'patient-2',
        ProgramId: 'program-1',
        EnrolledByUserId: 'user-1',
        DateCreated: new Date('2023-04-06'),
        Status: 'Active',
        Patient: this.patients[1]
      },
      {
        EnrollmentId: 'enroll-3',
        PatientId: 'patient-3',
        ProgramId: 'program-2',
        EnrolledByUserId: 'user-2',
        DateCreated: new Date('2023-04-10'),
        Status: 'Active',
        Patient: this.patients[2]
      }
    ];

    // Dummy programs
    this.programs = [
      {
        ProgramId: 'program-1',
        ProgramName: 'Diabetes Management',
        Description: 'Comprehensive program for managing diabetes and improving quality of life for patients with type 1 and type 2 diabetes.',
        DateCreated: new Date('2023-03-20'),
        DateModified: new Date('2023-03-20'),
        CreatedByUserId: 'user-1',
        CreatedBy: users[0],
        Enrollments: [enrollments[0], enrollments[1]]
      },
      {
        ProgramId: 'program-2',
        ProgramName: 'Hypertension Control',
        Description: 'Program designed to help patients monitor and control high blood pressure through medication management and lifestyle changes.',
        DateCreated: new Date('2023-03-25'),
        DateModified: new Date('2023-03-25'),
        CreatedByUserId: 'user-2',
        CreatedBy: users[1],
        Enrollments: [enrollments[2]]
      },
      {
        ProgramId: 'program-3',
        ProgramName: 'Maternal Health',
        Description: 'Support program for expectant mothers with regular check-ups and guidance throughout pregnancy.',
        DateCreated: new Date('2023-04-01'),
        DateModified: new Date('2023-04-01'),
        CreatedByUserId: 'user-1',
        CreatedBy: users[0],
        Enrollments: []
      }
    ];

    // Link enrollments to programs
    enrollments[0].Program = this.programs[0];
    enrollments[1].Program = this.programs[0];
    enrollments[2].Program = this.programs[1];
  }

  // Filter programs based on search term
  filterPrograms(): void {
    if (!this.searchTerm.trim()) {
      this.filteredPrograms = [...this.programs];
      return;
    }

    const term = this.searchTerm.toLowerCase().trim();
    this.filteredPrograms = this.programs.filter(program => 
      program.ProgramName.toLowerCase().includes(term) || 
      (program.Description && program.Description.toLowerCase().includes(term))
    );
  }

  // Search patients
  searchPatients(): void {
    if (!this.patientSearchTerm.trim()) {
        this.filteredPatients = [];
        return;
    }

    const term = this.patientSearchTerm.toLowerCase().trim();
    this.filteredPatients = this.patients.filter(patient => 
        !!patient.FullName && patient.FullName.toLowerCase().includes(term) || 
        (patient.Email && patient.Email.toLowerCase().includes(term)) ||
        (patient.Phone && patient.Phone.includes(term)) ||
        (patient.NationalId && patient.NationalId.toLowerCase().includes(term)
    )).filter(patient => 
        // Filter out patients that are already enrolled in this program
        !this.isPatientAlreadyEnrolled(patient)
    );
  }

  // Program form operations
  openProgramForm(): void {
    this.isEditMode = false;
    this.currentProgram = this.getEmptyProgram();
    this.showProgramForm = true;
  }

  openProgramUpdateForm(program: Program): void {
    this.isEditMode = true;
    this.currentProgram = { ...program };
    this.showProgramForm = true;
  }

  closeProgramForm(): void {
    this.showProgramForm = false;
  }

  saveProgram(): void {
    if (this.isEditMode) {
      // Update existing program
      const index = this.programs.findIndex(p => p.ProgramId === this.currentProgram.ProgramId);
      if (index !== -1) {
        this.currentProgram.DateModified = new Date();
        this.programs[index] = { ...this.currentProgram };
      }
    } else {
      // Add new program
      const newProgram: Program = {
        ...this.currentProgram,
        ProgramId: 'program-' + (this.programs.length + 1),
        DateCreated: new Date(),
        DateModified: new Date(),
        CreatedByUserId: 'user-1', // Assuming current user is user-1
        Enrollments: []
      };
      this.programs.push(newProgram);
    }

    this.filterPrograms();
    this.closeProgramForm();
  }

  // Delete operations
  openDeleteModal(program: Program): void {
    this.programToDelete = program;
    this.showDeleteModal = true;
  }

  closeDeleteModal(): void {
    this.showDeleteModal = false;
    this.programToDelete = null;
  }

  deleteProgram(): void {
    if (this.programToDelete) {
      this.programs = this.programs.filter(p => p.ProgramId !== this.programToDelete!.ProgramId);
      this.filterPrograms();
      this.closeDeleteModal();
    }
  }

  // Enroll operations
  openEnrollModal(program: Program): void {
    this.programToEnroll = program;
    this.selectedPatients = [];
    this.patientSearchTerm = '';
    this.filteredPatients = [];
    this.showEnrollModal = true;
  }

  closeEnrollModal(): void {
    this.showEnrollModal = false;
    this.programToEnroll = null;
    this.selectedPatients = [];
  }

  selectPatient(patient: Patient): void {
    if (!this.isPatientSelected(patient) && !this.isPatientAlreadyEnrolled(patient)) {
      this.selectedPatients.push(patient);
      // Remove from filtered list to avoid duplicate selections
      this.filteredPatients = this.filteredPatients.filter(p => p.PatientId !== patient.PatientId);
    }
  }

  removeSelectedPatient(patient: Patient): void {
    this.selectedPatients = this.selectedPatients.filter(p => p.PatientId !== patient.PatientId);
    // Add back to filtered list if it matches the current search
    if (this.patientMatchesSearch(patient)) {
      this.filteredPatients.push(patient);
    }
  }

  patientMatchesSearch(patient: Patient): boolean | string | undefined {
    if (!this.patientSearchTerm.trim()) return false;
    
    const term = this.patientSearchTerm.toLowerCase().trim();
    return patient.FullName.toLowerCase().includes(term) || 
      (patient.Email && patient.Email.toLowerCase().includes(term)) ||
      (patient.Phone && patient.Phone.includes(term)) ||
      (patient.NationalId && patient.NationalId.toLowerCase().includes(term));
  }

  isPatientSelected(patient: Patient): boolean {
    return this.selectedPatients.some(p => p.PatientId === patient.PatientId);
  }

  isPatientAlreadyEnrolled(patient: Patient): boolean {
    if (!this.programToEnroll || !this.programToEnroll.Enrollments) return false;
    
    return this.programToEnroll.Enrollments.some(e => e.PatientId === patient.PatientId);
  }

  enrollPatients(): void {
    if (this.programToEnroll && this.selectedPatients.length > 0) {
      // Create new enrollments
      for (const patient of this.selectedPatients) {
        const newEnrollment: Enrollment = {
          EnrollmentId: `enroll-${Date.now()}-${patient.PatientId}`,
          PatientId: patient.PatientId,
          ProgramId: this.programToEnroll.ProgramId,
          EnrolledByUserId: 'user-1', // Assuming current user is user-1
          DateCreated: new Date(),
          Status: 'Active',
          Patient: patient,
          Program: this.programToEnroll
        };

        // Add to program enrollments
        if (!this.programToEnroll.Enrollments) {
          this.programToEnroll.Enrollments = [];
        }
        this.programToEnroll.Enrollments.push(newEnrollment);
      }

      this.closeEnrollModal();
    }
  }

  // Helper functions
  getEmptyProgram(): Program {
    return {
      ProgramId: '',
      ProgramName: '',
      Description: '',
      DateCreated: new Date(),
      DateModified: new Date()
    };
  }

  getTotalEnrollments(): number {
    return this.programs.reduce((total, program) => 
      total + (program.Enrollments ? program.Enrollments.length : 0), 0);
  }

  getRecentProgramsCount(): number {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
    return this.programs.filter(program => program.DateCreated > thirtyDaysAgo).length;
  }

  closeAllModals(event: MouseEvent): void {
    if ((event.target as HTMLElement).classList.contains('overlay')) {
      this.showProgramForm = false;
      this.showDeleteModal = false;
      this.showEnrollModal = false;
    }
  }
}
