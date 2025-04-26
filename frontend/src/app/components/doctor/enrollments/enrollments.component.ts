import { Component, OnInit } from '@angular/core';
import { Enrollment, User, Patient, Program } from '../../../interfaces/assist.doc.interfaces';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-enrollments',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './enrollments.component.html',
  styleUrl: './enrollments.component.css'
})
export class EnrollmentsComponent implements OnInit {
  // Data
  enrollments: Enrollment[] = [];
  filteredEnrollments: Enrollment[] = [];
  
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

  constructor() { }

  ngOnInit(): void {
    this.loadEnrollments();
    this.applyFilters();
  }

  // Load dummy data
  loadEnrollments(): void {
    const mockUsers: User[] = [
      {
        UserId: '1',
        FullName: 'Dr. John Smith',
        Email: 'john.smith@assistantdoc.com',
        Phone: '+1234567890',
        Password: 'encrypted',
        Role: 'Doctor',
        IsWelcomed: true,
        DateCreated: new Date('2023-01-15')
      },
      {
        UserId: '2',
        FullName: 'Nurse Jane Doe',
        Email: 'jane.doe@assistantdoc.com',
        Phone: '+0987654321',
        Password: 'encrypted',
        Role: 'Nurse',
        IsWelcomed: true,
        DateCreated: new Date('2023-02-20')
      }
    ];

    const mockPatients: Patient[] = [
      {
        PatientId: '1',
        FullName: 'Michael Johnson',
        Email: 'michael@example.com',
        Phone: '+1122334455',
        DateOfBirth: new Date('1985-06-12'),
        NationalId: 'ABC123456',
        DateCreated: new Date('2023-03-10')
      },
      {
        PatientId: '2',
        FullName: 'Sarah Williams',
        Email: 'sarah@example.com',
        Phone: '+5566778899',
        DateOfBirth: new Date('1990-11-28'),
        NationalId: 'DEF789012',
        DateCreated: new Date('2023-04-05')
      },
      {
        PatientId: '3',
        FullName: 'Robert Brown',
        Email: 'robert@example.com',
        Phone: '+1231231234',
        DateOfBirth: new Date('1978-03-15'),
        NationalId: 'GHI345678',
        DateCreated: new Date('2023-05-20')
      },
      {
        PatientId: '4',
        FullName: 'Emily Davis',
        Email: 'emily@example.com',
        Phone: '+9876543210',
        DateOfBirth: new Date('1995-07-30'),
        NationalId: 'JKL901234',
        DateCreated: new Date('2023-06-15')
      }
    ];

    const mockPrograms: Program[] = [
      {
        ProgramId: '1',
        ProgramName: 'Diabetes Care',
        Description: 'Comprehensive care program for managing diabetes',
        DateCreated: new Date('2023-01-10'),
        DateModified: new Date('2023-02-15'),
        CreatedByUserId: '1',
        CreatedBy: mockUsers[0]
      },
      {
        ProgramId: '2',
        ProgramName: 'Cardiac Rehabilitation',
        Description: 'Program for patients recovering from heart conditions',
        DateCreated: new Date('2023-02-05'),
        DateModified: new Date('2023-03-20'),
        CreatedByUserId: '1',
        CreatedBy: mockUsers[0]
      },
      {
        ProgramId: '3',
        ProgramName: 'Prenatal Care',
        Description: 'Care program for expectant mothers',
        DateCreated: new Date('2023-03-15'),
        DateModified: new Date('2023-04-10'),
        CreatedByUserId: '2',
        CreatedBy: mockUsers[1]
      }
    ];

    // Create mock enrollments
    this.enrollments = [
      {
        EnrollmentId: '1',
        PatientId: '1',
        ProgramId: '1',
        EnrolledByUserId: '1',
        DateCreated: new Date('2023-04-15'),
        Status: 'Completed',
        Patient: mockPatients[0],
        Program: mockPrograms[0],
        EnrolledBy: mockUsers[0]
      },
      {
        EnrollmentId: '2',
        PatientId: '2',
        ProgramId: '2',
        EnrolledByUserId: '1',
        DateCreated: new Date('2023-05-10'),
        Status: 'Pending',
        Patient: mockPatients[1],
        Program: mockPrograms[1],
        EnrolledBy: mockUsers[0]
      },
      {
        EnrollmentId: '3',
        PatientId: '3',
        ProgramId: '1',
        EnrolledByUserId: '2',
        DateCreated: new Date('2023-06-05'),
        Status: 'Pending',
        Patient: mockPatients[2],
        Program: mockPrograms[0],
        EnrolledBy: mockUsers[1]
      },
      {
        EnrollmentId: '4',
        PatientId: '4',
        ProgramId: '3',
        EnrolledByUserId: '2',
        DateCreated: new Date('2023-07-01'),
        Status: 'Completed',
        Patient: mockPatients[3],
        Program: mockPrograms[2],
        EnrolledBy: mockUsers[1]
      }
    ];
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
    this.filteredEnrollments = this.filteredEnrollments.slice(startIndex, endIndex);
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
  updateStatus(enrollmentId: string, newStatus: string): void {
    const index = this.enrollments.findIndex(e => e.EnrollmentId === enrollmentId);
    if (index !== -1) {
      this.enrollments[index].Status = newStatus;
      // In a real application, you would call a service here
      // this.enrollmentService.updateStatus(enrollmentId, newStatus).subscribe(...);
      
      // For demo purposes, we'll just refresh the filters
      this.applyFilters();
    }
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
      
      // Remove from array
      this.enrollments = this.enrollments.filter(e => e.EnrollmentId !== enrollmentId);
      
      // In a real application, you would call a service here
      // this.enrollmentService.deleteEnrollment(enrollmentId).subscribe(...);
      
      // Close modal and refresh data
      this.closeDeleteModal();
      this.applyFilters();
    }
  }
}
