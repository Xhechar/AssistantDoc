import { AfterViewInit, Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Patient, Program, Enrollment, NotificationType, ServiceResponse } from '../../../interfaces/assist.doc.interfaces';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { EnrollmentService } from '../../../services/enrollment.service';
import { NotificationService } from '../../../services/modal/notification.service';
import { PatientService } from '../../../services/patient.service';
import { ProgramService } from '../../../services/program.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent implements OnInit, AfterViewInit {
  // Stats counters
  totalPatients: number = 0;
  totalPrograms: number = 0;
  totalEnrollments: number = 0;
  totalUsers: number = 0;
  
  // Growth percentages
  patientGrowth: number = 12.5;
  programGrowth: number = 25;
  enrollmentChange: number = 4.2;
  userGrowth: number = 8.3;
  
  // Date range
  currentDateRange: string = 'Apr 1 - Apr 26, 2025';
  
  // Animation flag
  newPatientsToday: boolean = true;
  
  // Data arrays to be populated from API
  recentPatients: Patient[] = [];
  activePrograms: Program[] = [];
  recentEnrollments: Enrollment[] = [];

  API_URL: string = 'http://localhost:3000/';
  
  constructor(
    private router: Router,
    private enrollmentService: EnrollmentService,
    private patientService: PatientService,
    private programService: ProgramService,
    private ns: NotificationService
  ) {}

  ngOnInit(): void {
    this.fetchRecentPatients();
    this.fetchActivePrograms();
    this.fetchRecentEnrollments();
  }

  ngAfterViewInit(): void {
    //
  }

  // Fetch recent patients
  private fetchRecentPatients(): void {
    this.patientService.getAllPatients().subscribe({
      next: (response) => {
        if (response.success && response.objects) {
          this.recentPatients = response.objects;
          this.totalPatients = this.recentPatients.length;
          this.ns.showAlert({
            notificationType: NotificationType.Success,
            message: 'Recent patients loaded successfully',
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
          message: error.error.message as string || 'Failed to fetch recent patients',
          title: 'Error'
        });
      }
    });
  }

  // Fetch active programs
  private fetchActivePrograms(): void {
    this.programService.getAllPrograms().subscribe({
      next: (response) => {
        if (response.success && response.objects) {
          this.activePrograms = response.objects;
          this.totalPrograms = this.activePrograms.length;
          this.ns.showAlert({
            notificationType: NotificationType.Success,
            message: 'Active programs loaded successfully',
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
          message: error.error.message as string || 'Failed to fetch active programs',
          title: 'Error'
        });
      }
    });
  }

  // Fetch recent enrollments
  private fetchRecentEnrollments(): void {
    this.enrollmentService.getAllEnrollments().subscribe({
      next: (response) => {
        if (response.success && response.objects) {
          this.recentEnrollments = response.objects;
          this.totalEnrollments = this.recentEnrollments.length;
          this.ns.showAlert({
            notificationType: NotificationType.Success,
            message: 'Recent enrollments loaded successfully',
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
          message: error.error.message as string || 'Failed to fetch recent enrollments',
          title: 'Error'
        });
      }
    });
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
    const searchTerm = (event.target as HTMLInputElement).value.toLowerCase().trim();
    
    try {
      if (!searchTerm) {
        this.recentPatients = [...this.recentPatients];
        this.ns.showAlert({
          notificationType: NotificationType.Success,
          message: `Displaying all ${this.recentPatients.length} patients`,
          title: 'Search Reset'
        });
        return;
      }

      const filteredPatients = this.recentPatients.filter(patient =>
        patient.FullName?.toLowerCase().includes(searchTerm) ||
        patient.Email?.toLowerCase().includes(searchTerm) ||
        patient.Phone?.toLowerCase().includes(searchTerm) ||
        patient.NationalId?.toLowerCase().includes(searchTerm)
      );

      this.recentPatients = filteredPatients;

      if (filteredPatients.length > 0) {
        this.ns.showAlert({
          notificationType: NotificationType.Success,
          message: `Found ${filteredPatients.length} patients matching search`,
          title: 'Search Success'
        });
      } else {
        this.ns.showAlert({
          notificationType: NotificationType.Warning,
          message: 'No patients found matching your search',
          title: 'No Results'
        });
      }
    } catch (error) {
      this.ns.showAlert({
        notificationType: NotificationType.Error,
        message: (error instanceof Error) ? error.message : 'Failed to search patients',
        title: 'Search Error'
      });
    }
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
