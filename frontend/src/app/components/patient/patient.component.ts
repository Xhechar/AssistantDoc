import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { Patient, User, Program, Enrollment, NotificationType } from '../../interfaces/assist.doc.interfaces';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NotificationService } from '../../services/modal/notification.service';
import { PatientService } from '../../services/patient.service';

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

  patientId: string = '';

  constructor(
    private route: ActivatedRoute,
    private location: Location,
    private patientService: PatientService,
    private ns: NotificationService
  ) { 
    const patientId = this.route.snapshot.paramMap.get('id');
    if (patientId) {
      this.patientId = patientId;
    } else {
      this.ns.showAlert({
        notificationType: NotificationType.Warning,
        message: 'No patient ID provided',
        title: 'Error'
      });
    }
  }

  ngOnInit(): void {
    if (this.patientId) {
      this.loadPatient(this.patientId);
    }
  }

  // Load patient data from API
  loadPatient(patientId: string): void {
    this.patientService.getPatientById(patientId).subscribe({
      next: (response) => {
        if (response.success && response.object) {
          this.patient = response.object;
          this.editPatient = { ...this.patient };
          this.ns.showAlert({
            notificationType: NotificationType.Success,
            message: 'Patient data loaded successfully',
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
          message: error.error.message as string || 'Failed to load patient data',
          title: 'Error'
        });
      }
    });
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
    if (this.patient) {
      if (!this.editPatient.FullName?.trim()) {
        this.ns.showAlert({
          notificationType: NotificationType.Warning,
          message: 'Patient name is required',
          title: 'Invalid Input'
        });
        return;
      }
      this.showModal(
        'Confirm Update', 
        'Are you sure you want to update this patient\'s information?',
        'updatePatient'
      );
    }
  }

  executeUpdatePatient(): void {
    this.patientService.updatePatient(this.editPatient.PatientId, {FullName: this.editPatient.FullName, NationalId: this.editPatient.NationalId, DateOfBirth: this.editPatient.DateOfBirth, Phone: this.editPatient.Phone}).subscribe({
      next: (response) => {
        if (response.success && response.object) {
          this.patient = response.object;
          this.loadPatient(this.patientId);
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
          message: error.error.message as string || 'Failed to update patient',
          title: 'Error'
        });
      }
    });
  }

  goBack(): void {
    this.location.back();
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
      this.executeUpdatePatient();
    }
    
    this.closeModal();
  }

}