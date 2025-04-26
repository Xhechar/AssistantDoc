import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Patient, User, Program, Enrollment } from '../../interfaces/assist.doc.interfaces';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-patient',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './patient.component.html',
  styleUrl: './patient.component.css'
})
export class PatientComponent implements OnInit {
  // Patient data
  patient: Patient | null = null;
  editPatient: Patient = {} as Patient;
  
  // UI State
  activeTab: string = 'enrollments';
  showConfirmModal: boolean = false;
  modalTitle: string = '';
  modalMessage: string = '';
  pendingAction: string = '';


  constructor(
    private route: ActivatedRoute,
    private location: Location
  ) { }

  ngOnInit(): void {
    // Get patient ID from route params
    const patientId = this.route.snapshot.paramMap.get('id');
    if (patientId) {
      this.loadPatientData(patientId);
    }
  }

  loadPatientData(patientId: string): void {
    // In a real application, this would be a service call
    // For demo purposes, we're using dummy data
    this.patient = this.getDummyPatient(patientId);
    
    // Initialize edit form with patient data
    this.editPatient = { ...this.patient };
    
  }

  getDummyPatient(patientId: string): Patient {
    // Create dummy users
    const doctor: User = {
      UserId: 'user-1',
      FullName: 'Dr. Jane Smith',
      Email: 'jane.smith@assistantdoc.com',
      Phone: '+1234567890',
      Password: '',
      Role: 'Doctor',
      IsWelcomed: true,
      DateCreated: new Date('2023-01-15')
    };
    
    const nurse: User = {
      UserId: 'user-2',
      FullName: 'Nurse Michael Johnson',
      Email: 'michael.johnson@assistantdoc.com',
      Phone: '+1987654321',
      Password: '',
      Role: 'Nurse',
      IsWelcomed: true,
      DateCreated: new Date('2023-02-10')
    };
    
    // Create dummy programs
    const diabetesProgram: Program = {
      ProgramId: 'prog-1',
      ProgramName: 'Diabetes Management',
      Description: 'Comprehensive program for managing diabetes and preventing complications.',
      DateCreated: new Date('2023-01-01'),
      DateModified: new Date('2023-06-15'),
      CreatedByUserId: doctor.UserId,
      CreatedBy: doctor
    };
    
    const hypertensionProgram: Program = {
      ProgramId: 'prog-2',
      ProgramName: 'Hypertension Control',
      Description: 'Program designed to monitor and control high blood pressure.',
      DateCreated: new Date('2023-02-01'),
      DateModified: new Date('2023-07-10'),
      CreatedByUserId: doctor.UserId,
      CreatedBy: doctor
    };
    
    const weightManagementProgram: Program = {
      ProgramId: 'prog-3',
      ProgramName: 'Weight Management',
      Description: 'Program focused on healthy weight loss and maintenance.',
      DateCreated: new Date('2023-03-15'),
      DateModified: new Date('2023-08-20'),
      CreatedByUserId: nurse.UserId,
      CreatedBy: nurse
    };
    
    // Create dummy enrollments
    const enrollments: Enrollment[] = [
      {
        EnrollmentId: 'enr-1',
        PatientId: patientId,
        ProgramId: diabetesProgram.ProgramId,
        EnrolledByUserId: doctor.UserId,
        DateCreated: new Date('2023-06-01'),
        Status: 'Active',
        Program: diabetesProgram,
        EnrolledBy: doctor
      },
      {
        EnrollmentId: 'enr-2',
        PatientId: patientId,
        ProgramId: hypertensionProgram.ProgramId,
        EnrolledByUserId: nurse.UserId,
        DateCreated: new Date('2023-07-15'),
        Status: 'Active',
        Program: hypertensionProgram,
        EnrolledBy: nurse
      },
      {
        EnrollmentId: 'enr-3',
        PatientId: patientId,
        ProgramId: weightManagementProgram.ProgramId,
        EnrolledByUserId: doctor.UserId,
        DateCreated: new Date('2023-08-30'),
        Status: 'Completed',
        Program: weightManagementProgram,
        EnrolledBy: doctor
      }
    ];
    
    // Create dummy patient
    return {
      PatientId: patientId,
      FullName: 'John Doe',
      Phone: '+1555123456',
      Email: 'john.doe@example.com',
      DateOfBirth: new Date('1985-04-15'),
      NationalId: 'ID123456789',
      DateCreated: new Date('2023-05-20'),
      Enrollments: enrollments
    };
  }

  setActiveTab(tab: string): void {
    this.activeTab = tab;
  }

  getInitials(name: string | undefined): string {
    if (!name) return 'P';
    
    const names = name.split(' ');
    if (names.length > 1) {
      return `${names[0].charAt(0)}${names[names.length - 1].charAt(0)}`.toUpperCase();
    }
    return name.charAt(0).toUpperCase();
  }

  getTotalEnrollments(): number {
    return this.patient?.Enrollments?.length || 0;
  }

  getActiveEnrollments(): number {
    return this.patient?.Enrollments?.filter(e => e.Status === 'Active').length || 0;
  }

  getDaysAsMember(): number {
    if (!this.patient?.DateCreated) return 0;
    
    const createdDate = new Date(this.patient.DateCreated);
    const today = new Date();
    const diffTime = Math.abs(today.getTime() - createdDate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 
    return diffDays;
  }

  updatePatient(): void {
    // In a real application, this would be a service call
    if (this.patient) {
      this.showModal(
        'Confirm Update', 
        'Are you sure you want to update this patient\'s information?',
        'updatePatient'
      );
    }
  }

  goBack(): void {
    // this.location.back();
  }

  resetForm(): void {
    if (this.patient) {
      this.editPatient = { ...this.patient };
    }
  }

  // Modal functions
  showModal(title: string, message: string, action: string): void {
    this.modalTitle = title;
    this.modalMessage = message;
    this.pendingAction = action;
    this.showConfirmModal = true;
  }

  closeModal(): void {
    this.showConfirmModal = false;
  }

  confirmAction(): void {
    if (this.pendingAction === 'updatePatient') {
      // this.executeUpdatePatient();
    }
    
    this.closeModal();
  }

}