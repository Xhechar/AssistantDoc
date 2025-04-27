import { Component, OnInit } from '@angular/core';
import { Enrollment, User, Patient, Program, NotificationType } from '../../../interfaces/assist.doc.interfaces';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { EnrollmentService } from '../../../services/enrollment.service';
import { NotificationService } from '../../../services/modal/notification.service';
import { NotificationComponent } from "../../notification/notification.component";

@Component({
  selector: 'app-enrollments',
  standalone: true,
  imports: [CommonModule, FormsModule, NotificationComponent],
  templateUrl: './enrollments.component.html',
  styleUrl: './enrollments.component.css'
})
export class EnrollmentsComponent implements OnInit {
  // Data
  enrollments: Enrollment[] = [];
  filteredEnrollments: Enrollment[] = [];
  displayedEnrollments: Enrollment[] = []; // Added to store paginated results
  
  // Pagination
  itemsPerPage: number = 5;
  currentPage: number = 1;
  totalPages: number = 1;
  
  // Filters
  searchTerm: string = '';
  selectedProgram: string = '';
  selectedStatus: string = '';
  sortOrder: 'newest' | 'oldest' = 'newest';
  activeTab: 'all' | 'pending' | 'completed' = 'all';
  
  // Modal
  deleteModal: boolean = false;
  selectedEnrollment: Enrollment | null = null;

  constructor(
    private enrollmentService: EnrollmentService,
    private ns: NotificationService
  ) { }

  ngOnInit(): void {
    this.loadEnrollments();
    this.applyFilters();
  }

  // Load enrollments from API
  loadEnrollments(): void {
    this.enrollmentService.getAllEnrollments().subscribe({
      next: (response) => {
        if (response.success && response.object) {
          this.enrollments = response.object as unknown as Enrollment[];
          this.applyFilters();
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
          message: error.error.message as string || 'Failed to load enrollments',
          title: error.error.error as string
        });
      }
    });
  }

  // Filter Methods
  applyFilters(): void {
    let result = [...this.enrollments];

    // Apply tab filter
    if (this.activeTab === 'pending') {
      result = result.filter(e => e.Status === 'Pending');
    } else if (this.activeTab === 'completed') {
      result = result.filter(e => e.Status === 'Completed');
    }

    // Apply search
    if (this.searchTerm) {
      const search = this.searchTerm.toLowerCase();
      result = result.filter(e => 
        e.Patient?.FullName.toLowerCase().includes(search) ||
        e.Program?.ProgramName.toLowerCase().includes(search) ||
        e.Patient?.Email?.toLowerCase().includes(search) ||
        e.Patient?.Phone?.toLowerCase().includes(search)
      );
    }

    // Apply program filter
    if (this.selectedProgram) {
      result = result.filter(e => e.Program?.ProgramName === this.selectedProgram);
    }

    // Apply status filter
    if (this.selectedStatus) {
      result = result.filter(e => e.Status === this.selectedStatus);
    }

    // Apply sort
    result.sort((a, b) => {
      if (this.sortOrder === 'newest') {
        return new Date(b.DateCreated).getTime() - new Date(a.DateCreated).getTime();
      } else {
        return new Date(a.DateCreated).getTime() - new Date(b.DateCreated).getTime();
      }
    });

    this.filteredEnrollments = result;
    this.updatePagination();
  }

  // Update pagination based on filtered results
  updatePagination(): void {
    this.totalPages = Math.ceil(this.filteredEnrollments.length / this.itemsPerPage);
    if (this.currentPage > this.totalPages) {
      this.currentPage = this.totalPages || 1;
    }

    // Apply pagination to filtered results
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    this.displayedEnrollments = this.filteredEnrollments.slice(startIndex, endIndex);
  }

  // Reset all filters
  resetFilters(): void {
    this.searchTerm = '';
    this.selectedProgram = '';
    this.selectedStatus = '';
    this.sortOrder = 'newest';
    this.activeTab = 'all';
    this.currentPage = 1;
    this.applyFilters();
  }

  // Change page for pagination
  changePage(page: number): void {
    this.currentPage = page;
    this.applyFilters();
  }

  // Filter setters
  setSelectedProgram(program: string): void {
    this.selectedProgram = program;
    this.currentPage = 1;
    this.applyFilters();
  }

  setSelectedStatus(status: string): void {
    this.selectedStatus = status;
    this.currentPage = 1;
    this.applyFilters();
  }

  setSortOrder(order: 'newest' | 'oldest'): void {
    this.sortOrder = order;
    this.applyFilters();
  }

  // Get unique program names for filter dropdown
  getUniquePrograms(): string[] {
    const programs = this.enrollments.map(e => e.Program?.ProgramName);
    return [...new Set(programs.filter(p => p !== undefined))] as string[];
  }

  // Get enrollments by status
  getPendingEnrollments(): Enrollment[] {
    return this.enrollments.filter(e => e.Status === 'Pending');
  }

  getCompletedEnrollments(): Enrollment[] {
    return this.enrollments.filter(e => e.Status === 'Completed');
  }

  // Get total unique patients
  getTotalPatients(): number {
    const patientIds = this.enrollments.map(e => e.PatientId);
    return new Set(patientIds).size;
  }

  // Enrollment actions
  updateStatus(enrollmentId: string): void {
    this.enrollmentService.toggleEnrollmentStatus(enrollmentId).subscribe({
      next: (response) => {
        if (response.success) {
          this.loadEnrollments();this.applyFilters();
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
          message: error.error.message as string || 'Failed to update enrollment status',
          title: error.error.error as string
        });
      }
    });
  }

  // Modal Actions
  openDeleteModal(enrollment: Enrollment): void {
    this.selectedEnrollment = enrollment;
    this.deleteModal = true;
  }

  closeDeleteModal(): void {
    this.deleteModal = false;
    this.selectedEnrollment = null;
  }

  deleteEnrollment(): void {
    if (this.selectedEnrollment) {
      const enrollmentId = this.selectedEnrollment.EnrollmentId;
      this.enrollmentService.deleteEnrollment(enrollmentId).subscribe({
        next: (response) => {
          if (response.success) {
            this.enrollments = this.enrollments.filter(e => e.EnrollmentId !== enrollmentId);
            this.closeDeleteModal();
            this.applyFilters();
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
            message: error.error.message as string || 'Failed to delete enrollment',
            title: error.error.error as string
          });
        }
      });
    }
  }
}
