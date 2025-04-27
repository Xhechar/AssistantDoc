import { Component, OnInit } from '@angular/core';
import { Program, Patient, User, Enrollment, NotificationType } from '../../../interfaces/assist.doc.interfaces';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { EnrollmentService } from '../../../services/enrollment.service';
import { NotificationService } from '../../../services/modal/notification.service';
import { PatientService } from '../../../services/patient.service';
import { ProgramService } from '../../../services/program.service';
import { EnrollPatientDto, UpdateEnrollmentDto, UpdateProgramDto } from '../../../interfaces/assist.doc.dtos';
import { NotificationComponent } from "../../notification/notification.component";

@Component({
  selector: 'app-programs',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, NotificationComponent],
  templateUrl: './programs.component.html',
  styleUrl: './programs.component.css'
})
export class ProgramsComponent implements OnInit {
  // Programs data
  programs: Program[] = [];
  filteredPrograms: Program[] = [];
  searchTerm: string = '';
  enrollments: number = 0;
  recentPrograms: number = 0;

  // Modal states
  showProgramForm: boolean = false;
  showDeleteModal: boolean = false;
  showEnrollModal: boolean = false;
  isEditMode: boolean = false;

  // Program
  currentProgramId: string = '';

  // Current program for operations
  currentProgram: Program = this.getEmptyProgram();
  programToDelete: Program | null = null;
  programToEnroll: Program | null = null;

  // Patients data
  patients: Patient[] = [];
  filteredPatients: Patient[] = [];
  selectedPatients: Patient[] = [];
  patientSearchTerm: string = '';

  constructor(
    private programService: ProgramService,
    private patientService: PatientService,
    private enrollmentService: EnrollmentService,
    private ns: NotificationService
  ) { }

  ngOnInit(): void {
    this.loadData();
    this.enrollments = this.getTotalEnrollments();
  }

  // Load programs and patients from API
  loadData(): void {
    // Load programs
    this.programService.getAllPrograms().subscribe({
      next: (response) => {
        if (response.success && response.object) {
          this.programs = response.object as unknown as Program[];
          this.filteredPrograms = [...this.programs];
          // this.ns.showAlert({
          //   notificationType: NotificationType.Success,
          //   message: 'Programs loaded successfully',
          //   title: 'Success'
          // });
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
          message: error.error.message || 'Failed to load programs',
          title: error.error.error as string
        });
      }
    });

    // Load patients
    this.patientService.getAllPatients().subscribe({
      next: (response) => {
        if (response.success && response.object) {
          this.patients = response.object as unknown as Patient[];
          // this.ns.showAlert({
          //   notificationType: NotificationType.Success,
          //   message: 'Patients loaded successfully',
          //   title: 'Success'
          // });
        } else {
          // this.ns.showAlert({
          //   notificationType: NotificationType.Warning,
          //   message: response.message,
          //   title: response.error as string
          // });
        }
      },
      error: (error) => {
        this.ns.showAlert({
          notificationType: NotificationType.Error,
          message: error.error.message as string || 'Failed to load patients',
          title: error.error.error as string
        });
      }
    });
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
    this.currentProgramId = program.ProgramId;
    this.isEditMode = true;
    this.currentProgram = { ...program };
    this.showProgramForm = true;
  }

  closeProgramForm(): void {
    this.showProgramForm = false;
  }

  saveProgram(): void {
    if (!this.currentProgram.ProgramName.trim()) {
      this.ns.showAlert({
        notificationType: NotificationType.Warning,
        message: 'Program name is required',
        title: 'Invalid Input'
      });
      return;
    }
    

    if (this.isEditMode) {
      console.log(this.currentProgramId, this.currentProgram);
      
      this.programService.updateProgram(this.currentProgramId, {ProgramName: this.currentProgram.ProgramName, Description: this.currentProgram.Description}).subscribe({
        next: (response) => {
          if (response.success) {
            this.currentProgramId = '';
            this.loadData();
            this.filterPrograms();
            this.closeProgramForm();
            this.ns.showAlert({
              notificationType: NotificationType.Success,
              message: 'Program updated successfully',
              title: 'Success'
            });
          } else {
            this.currentProgramId = '';
            this.ns.showAlert({
              notificationType: NotificationType.Warning,
              message: response.message,
              title: response.error as string
            });
          }
        },
        error: (error) => {
          this.currentProgramId = '';
          this.ns.showAlert({
            notificationType: NotificationType.Error,
            message: error.error.message as string || 'Failed to update program',
            title: error.error.error as string
          });
        }
      });
    } else {
      // Add new program
      this.programService.createProgram({ProgramName: this.currentProgram.ProgramName, Description: this.currentProgram.Description}).subscribe({
        next: (response) => {
          if (response.success) {
            this.loadData();
            this.filterPrograms();
            this.closeProgramForm();
            this.ns.showAlert({
              notificationType: NotificationType.Success,
              message: response.message,
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
              message: error.error.message as string || 'Failed to create program',
              title: error.error.error as string
            });
          }
        });
      }
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
      const programId = this.programToDelete.ProgramId;
      this.programService.deleteProgram(programId).subscribe({
        next: (response) => {
          if (response.success) {
            this.programs = this.programs.filter(p => p.ProgramId !== programId);
            this.filterPrograms();
            this.closeDeleteModal();
            this.ns.showAlert({
              notificationType: NotificationType.Success,
              message: 'Program deleted successfully',
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
            message: error.error.message as string || 'Failed to delete program',
            title: error.error.error as string
          });
        }
      });
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
      const enrollments = this.selectedPatients.map(patient => ({
        PatientId: patient.PatientId,
        ProgramId: this.programToEnroll!.ProgramId
      }));

      let objs: EnrollPatientDto[] = [];

      for (const enrollment of enrollments) {
        objs.push( {
          PatientId: enrollment.PatientId,
          ProgramId: enrollment.ProgramId,
          EnrolledByUserId: ''
        });
      }

      this.enrollmentService.enrollPatient(objs).subscribe({
        next: (response) => {
          if (response.success && response.objects) {
            const index = this.programs.findIndex(p => p.ProgramId === this.programToEnroll!.ProgramId);
            this.loadData();
            this.closeEnrollModal();
            this.ns.showAlert({
              notificationType: NotificationType.Success,
              message: `${this.selectedPatients.length} patient(s) enrolled successfully`,
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
            message: error.error.message as string || 'Failed to enroll patients',
            title: error.error.error as string
          });
        }
      });
    } else {
      this.ns.showAlert({
        notificationType: NotificationType.Warning,
        message: 'No patients selected for enrollment',
        title: 'Warning'
      });
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
    let count = 0;
    this.enrollmentService.getAllEnrollments().subscribe({
      next: (response) => {
        if (response.success && response.object) {
          count = (response.object as unknown as Enrollment[]).length;
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
          message: error.error.message || 'Failed to load enrollments',
          title: error.error.error as string
        });
      }
    });
    return count;
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
