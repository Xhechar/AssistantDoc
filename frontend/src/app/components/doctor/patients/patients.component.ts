import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { NotificationType, Patient } from '../../../interfaces/assist.doc.interfaces';
import { CommonModule } from '@angular/common';
import { NotificationService } from '../../../services/modal/notification.service';
import { PatientService } from '../../../services/patient.service';
import { RegisterPatientDto, UpdatePatientDto } from '../../../interfaces/assist.doc.dtos';

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
    private router: Router,
    private patientService: PatientService,
    private ns: NotificationService
  ) {
    this.patientForm = this.fb.group({
      FullName: ['', Validators.required],
      Email: ['', Validators.email],
      Phone: [''],
      DateOfBirth: [''],
      NationalId: ['']
    });
  }

  ngOnInit(): void {
    this.loadPatients();
    this.applyFilters();
  }

  // Load patients from API
  loadPatients(): void {
    this.patientService.getAllPatients().subscribe({
      next: (response) => {
        if (response.success && response.object) {
          this.patients = response.object as unknown as Patient[];
          this.applyFilters();
          this.ns.showAlert({
            notificationType: NotificationType.Success,
            message: 'Patients loaded successfully',
            title: 'Success'
          });
        } else {
          this.ns.showAlert({
            notificationType: NotificationType.Warning,
            message: response.message,
            title: response.error as string
          });
        }
      },
      error: (error) => {
        this.ns.showAlert({
          notificationType: NotificationType.Error,
          message: error.message as string || 'Failed to load patients',
          title: error.error as string
        });
      }
    });
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
      this.ns.showAlert({
        notificationType: NotificationType.Warning,
        message: 'Please fill in all required fields correctly',
        title: 'Invalid Form'
      });
      return;
    }
    
    const patientData: UpdatePatientDto = this.patientForm.value;
    const createPatient: RegisterPatientDto = this.patientForm.value;
    
    if (this.isEditMode && this.selectedPatient) {
      // Update existing patient
      this.patientService.updatePatient(this.selectedPatient.PatientId, patientData).subscribe({
        next: (response) => {
          if (response.success) {
            this.loadPatients();
            this.closePatientForm();
            this.applyFilters();
            this.ns.showAlert({
              notificationType: NotificationType.Success,
              message: 'Patient updated successfully',
              title: 'Success'
            });
          } else {
            this.ns.showAlert({
              notificationType: NotificationType.Warning,
              message: response.message,
              title: response.error as string
            });
          }
        },
        error: (error) => {
          this.ns.showAlert({
            notificationType: NotificationType.Error,
            message: error.message as string || 'Failed to update patient',
            title: error.error as string
          });
        }
      });
    } else {
      // Create new patient
      this.patientService.registerPatient(createPatient).subscribe({
        next: (response) => {
          if (response.success && response.object) {
            this.patients.unshift(response.object);
            this.closePatientForm();
            this.applyFilters();
            this.ns.showAlert({
              notificationType: NotificationType.Success,
              message: 'Patient added successfully',
              title: 'Success'
            });
          } else {
            this.ns.showAlert({
              notificationType: NotificationType.Warning,
              message: response.message,
              title: response.error as string
            });
          }
        },
        error: (error) => {
          this.ns.showAlert({
            notificationType: NotificationType.Error,
            message: error.message as string || 'Failed to add patient',
            title: error.error as string
          });
        }
      });
    }
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
      const patientId = this.patientToDelete.PatientId;
      this.patientService.deletePatient(patientId).subscribe({
        next: (response) => {
          if (response.success) {
            this.patients = this.patients.filter(p => p.PatientId !== patientId);
            this.cancelDelete();
            this.applyFilters();
            this.ns.showAlert({
              notificationType: NotificationType.Success,
              message: 'Patient deleted successfully',
              title: 'Success'
            });
          } else {
            this.ns.showAlert({
              notificationType: NotificationType.Warning,
              message: response.message,
              title: response.error as string
            });
          }
        },
        error: (error) => {
          this.ns.showAlert({
            notificationType: NotificationType.Error,
            message: error.message as string || 'Failed to delete patient',
            title: error.error as string
          });
        }
      });
    }
  }

  viewPatient(patient: Patient): void {
    this.router.navigate(['/patient', patient.PatientId]);
  }

  sharePatient(patient: Patient): void {
    this.selectedPatient = patient;
    this.patientShareUrl = `${window.location.origin}/patient/${patient.PatientId}`;
    this.showShareModal = true;
    navigator.clipboard.writeText(this.patientShareUrl).then(() => {
      this.ns.showAlert({
        notificationType: NotificationType.Success,
        message: 'Link copied to clipboard',
        title: 'Success'
      });
    }).catch(() => {
      this.ns.showAlert({
        notificationType: NotificationType.Error,
        message: 'Failed to copy link to clipboard',
        title: 'Error'
      });
    });
  }

  closeShareModal(): void {
    this.showShareModal = false;
  }

  copyShareLink(input: HTMLInputElement): void {
    input.select();
    document.execCommand('copy');
    this.ns.showAlert({
      notificationType: NotificationType.Success,
      message: 'Link copied to clipboard',
      title: 'Success'
    });
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
}