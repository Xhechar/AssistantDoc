import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Patient } from '../../../interfaces/assist.doc.interfaces';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-patients',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './patients.component.html',
  styleUrl: './patients.component.css'
})
export class PatientsComponent implements OnInit {
  // Display control
  showPatientForm: boolean = false;
  showDeleteConfirmation: boolean = false;
  showShareModal: boolean = false;
  isEditMode: boolean = false;
  
  // Patient data
  patients: Patient[] = [];
  filteredPatients: Patient[] = [];
  selectedPatient: Patient | null = null;
  patientToDelete: Patient | null = null;
  patientShareUrl: string = '';
  
  // Form
  patientForm: FormGroup;
  
  // Pagination
  itemsPerPage: number = 5;
  currentPage: number = 1;
  totalPages: number = 1;
  
  // Search and filter
  searchTerm: string = '';
  filterOption: string = 'all';

  constructor(
    private fb: FormBuilder,
    private router: Router
  ) {
    this.patientForm = this.fb.group({
      PatientId: [''],
      FullName: ['', Validators.required],
      Email: ['', Validators.email],
      Phone: [''],
      DateOfBirth: [''],
      NationalId: [''],
      DateCreated: [new Date()]
    });
  }

  ngOnInit(): void {
    this.loadDummyData();
    this.applyFilters();
  }

  // Load dummy data for demonstration
  loadDummyData(): void {
    const now = new Date();
    const yesterday = new Date(now);
    yesterday.setDate(yesterday.getDate() - 1);
    const lastWeek = new Date(now);
    lastWeek.setDate(lastWeek.getDate() - 7);
    const lastMonth = new Date(now);
    lastMonth.setMonth(lastMonth.getMonth() - 1);
    
    this.patients = [
      {
        PatientId: '1',
        FullName: 'John Doe',
        Email: 'john.doe@example.com',
        Phone: '+1234567890',
        DateOfBirth: new Date(1985, 5, 15),
        NationalId: 'ABC123456',
        DateCreated: now,
        Enrollments: [
          {
            EnrollmentId: '101',
            PatientId: '1',
            ProgramId: 'P1',
            DateCreated: now,
            Status: 'Active'
          },
          {
            EnrollmentId: '102',
            PatientId: '1',
            ProgramId: 'P2',
            DateCreated: yesterday,
            Status: 'Active'
          }
        ]
      },
      {
        PatientId: '2',
        FullName: 'Jane Smith',
        Email: 'jane.smith@example.com',
        Phone: '+1987654321',
        DateOfBirth: new Date(1990, 8, 21),
        NationalId: 'DEF789012',
        DateCreated: yesterday,
        Enrollments: [
          {
            EnrollmentId: '103',
            PatientId: '2',
            ProgramId: 'P3',
            DateCreated: lastWeek,
            Status: 'Active'
          }
        ]
      },
      {
        PatientId: '3',
        FullName: 'Robert Johnson',
        Email: 'robert.johnson@example.com',
        Phone: '+1122334455',
        DateOfBirth: new Date(1978, 3, 10),
        NationalId: 'GHI345678',
        DateCreated: lastWeek,
        Enrollments: []
      },
      {
        PatientId: '4',
        FullName: 'Maria Garcia',
        Email: 'maria.garcia@example.com',
        Phone: '+1555666777',
        DateOfBirth: new Date(1995, 11, 5),
        NationalId: 'JKL901234',
        DateCreated: lastMonth,
        Enrollments: [
          {
            EnrollmentId: '104',
            PatientId: '4',
            ProgramId: 'P1',
            DateCreated: lastMonth,
            Status: 'Completed'
          }
        ]
      }
    ];
  }

  // CRUD Operations
  openPatientForm(): void {
    this.isEditMode = false;
    this.patientForm.reset({
      PatientId: '',
      DateCreated: new Date()
    });
    this.showPatientForm = true;
  }

  closePatientForm(): void {
    this.showPatientForm = false;
  }

  editPatient(patient: Patient): void {
    this.isEditMode = true;
    this.selectedPatient = patient;
    
    this.patientForm.patchValue({
      PatientId: patient.PatientId,
      FullName: patient.FullName,
      Email: patient.Email,
      Phone: patient.Phone,
      DateOfBirth: patient.DateOfBirth ? this.formatDateForInput(patient.DateOfBirth) : '',
      NationalId: patient.NationalId,
      DateCreated: patient.DateCreated
    });
    
    this.showPatientForm = true;
  }

  savePatient(): void {
    if (this.patientForm.invalid) {
      return;
    }
    
    const patientData: Patient = this.patientForm.value;
    
    if (this.isEditMode && this.selectedPatient) {
      // Update existing patient
      const index = this.patients.findIndex(p => p.PatientId === patientData.PatientId);
      if (index !== -1) {
        // Preserve enrollments from existing patient
        patientData.Enrollments = this.patients[index].Enrollments;
        this.patients[index] = patientData;
        this.showToast('Patient updated successfully');
      }
    } else {
      // Create new patient
      patientData.PatientId = this.generateId();
      patientData.DateCreated = new Date();
      patientData.Enrollments = [];
      this.patients.unshift(patientData);
      this.showToast('Patient added successfully');
    }
    
    this.closePatientForm();
    this.applyFilters();
  }

  confirmDelete(patient: Patient): void {
    this.patientToDelete = patient;
    this.showDeleteConfirmation = true;
  }

  cancelDelete(): void {
    this.patientToDelete = null;
    this.showDeleteConfirmation = false;
  }

  deletePatient(): void {
    if (this.patientToDelete) {
      this.patients = this.patients.filter(p => p.PatientId !== this.patientToDelete?.PatientId);
      this.showToast('Patient deleted successfully');
      this.cancelDelete();
      this.applyFilters();
    }
  }

  viewPatient(patient: Patient): void {
    // In a real application, navigate to patient details page
    console.log('Viewing patient:', patient);
    // this.router.navigate(['/patients', patient.PatientId]);
  }

  sharePatient(patient: Patient): void {
    this.selectedPatient = patient;
    this.patientShareUrl = `${window.location.origin}/patients/${patient.PatientId}`;
    this.showShareModal = true;
  }

  closeShareModal(): void {
    this.showShareModal = false;
  }

  copyShareLink(input: HTMLInputElement): void {
    input.select();
    document.execCommand('copy');
    this.showToast('Link copied to clipboard');
  }

  // Pagination
  changePage(page: number): void {
    this.currentPage = page;
    this.applyPagination();
  }

  applyPagination(): void {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    this.filteredPatients = this.applyFiltersToData().slice(startIndex, endIndex);
  }

  // Search and Filtering
  applyFilters(): void {
    const filteredData = this.applyFiltersToData();
    this.totalPages = Math.ceil(filteredData.length / this.itemsPerPage);
    this.currentPage = 1;
    this.applyPagination();
  }

  applyFiltersToData(): Patient[] {
    let result = [...this.patients];
    
    // Apply search
    if (this.searchTerm.trim()) {
      const searchLower = this.searchTerm.toLowerCase().trim();
      result = result.filter(patient => 
        patient.FullName.toLowerCase().includes(searchLower) ||
        (patient.Email && patient.Email.toLowerCase().includes(searchLower)) ||
        (patient.Phone && patient.Phone.toLowerCase().includes(searchLower)) ||
        (patient.NationalId && patient.NationalId.toLowerCase().includes(searchLower))
      );
    }
    
    // Apply filters
    switch (this.filterOption) {
      case 'recent':
        const oneWeekAgo = new Date();
        oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
        result = result.filter(patient => new Date(patient.DateCreated) >= oneWeekAgo);
        break;
      case 'enrolled':
        result = result.filter(patient => patient.Enrollments && patient.Enrollments.length > 0);
        break;
    }
    
    return result;
  }

  // Utility Methods
  formatDateForInput(date: Date): string {
    const d = new Date(date);
    const month = (`0${d.getMonth() + 1}`).slice(-2);
    const day = (`0${d.getDate()}`).slice(-2);
    return `${d.getFullYear()}-${month}-${day}`;
  }

  generateId(): string {
    return Math.random().toString(36).substring(2, 15);
  }

  getNewPatientsCount(): number {
    const oneMonthAgo = new Date();
    oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
    return this.patients.filter(patient => new Date(patient.DateCreated) >= oneMonthAgo).length;
  }

  getActiveEnrollmentsCount(): number {
    return this.patients.reduce((count, patient) => {
      const activeEnrollments = patient.Enrollments?.filter(e => e.Status === 'Active') || [];
      return count + activeEnrollments.length;
    }, 0);
  }

  showToast(message: string): void {
    // Create toast element
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.innerHTML = `
      <i class="bx bx-check-circle"></i>
      <span>${message}</span>
    `;
    document.body.appendChild(toast);
    
    // Show toast
    setTimeout(() => {
      toast.classList.add('show');
    }, 100);
    
    // Hide and remove toast
    setTimeout(() => {
      toast.classList.remove('show');
      setTimeout(() => {
        document.body.removeChild(toast);
      }, 300);
    }, 3000);
  }
}