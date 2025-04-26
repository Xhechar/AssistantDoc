import { Component, OnInit } from '@angular/core';
import { Enrollment, Patient, Program, User } from '../../../interfaces/assist.doc.interfaces';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css'
})
export class ProfileComponent implements OnInit {
  // User data
  user: User;
  
  // UI State
  activeTab: string = 'programs';
  searchTerm: string = '';
  activityFilter: string = 'all';
  showPassword: boolean = false;
  
  // Modal state
  showConfirmationModal: boolean = false;
  confirmationModalTitle: string = '';
  confirmationModalMessage: string = '';
  pendingAction: Function | null = null;
  
  // Toast notification state
  showToast: boolean = false;
  toastMessage: string = '';
  toastType: 'success' | 'error' = 'success';
  
  // Settings form
  settingsForm = {
    fullName: '',
    email: '',
    phone: '',
    role: '',
    password: '',
    confirmPassword: ''
  };
  
  // Activity data
  activityList = [
    {
      type: 'program',
      icon: 'bx bxs-folder-plus',
      title: 'Created a new program',
      description: 'You created the "Diabetes Management" program',
      date: new Date(2025, 3, 25)
    },
    {
      type: 'enrollment',
      icon: 'bx bxs-user-plus',
      title: 'Enrolled a new patient',
      description: 'You enrolled John Doe to the "Hypertension Management" program',
      date: new Date(2025, 3, 24)
    },
    {
      type: 'login',
      icon: 'bx bxs-log-in-circle',
      title: 'New login',
      description: 'You logged in from a new device (Windows PC)',
      date: new Date(2025, 3, 23)
    },
    {
      type: 'program',
      icon: 'bx bxs-edit',
      title: 'Updated program',
      description: 'You updated details for "COVID-19 Vaccination" program',
      date: new Date(2025, 3, 22)
    }
  ];

  constructor() {
    // Initialize with dummy data
    this.user = this.getDummyUserData();
  }

  ngOnInit(): void {
    this.loadUserSettings();
  }

  // Tab functionality
  setActiveTab(tab: string): void {
    this.activeTab = tab;
  }

  // Progress calculation for stat cards
  getProgressWidth(current: number, max: number): string {
    const percentage = Math.min((current / max) * 100, 100);
    return `${percentage}%`;
  }

  // Count enrollments across programs
  getEnrollmentsCount(): number {
    const enrollmentsFromPrograms = this.user.ProgramsCreated?.reduce((count, program) => {
      return count + (program.Enrollments?.length || 0);
    }, 0) || 0;
    
    return enrollmentsFromPrograms + (this.user.Enrollments?.length || 0);
  }

  // Calculate days active
  getDaysActive(): number {
    const createdDate = new Date(this.user.DateCreated);
    const today = new Date();
    const timeDiff = today.getTime() - createdDate.getTime();
    return Math.floor(timeDiff / (1000 * 3600 * 24));
  }

  // Filter enrollments based on search term
  filteredEnrollments(): Enrollment[] {
    let enrollments: Enrollment[] = [];
    
    // Collect enrollments from all programs
    if (this.user.ProgramsCreated) {
      this.user.ProgramsCreated.forEach(program => {
        if (program.Enrollments) {
          enrollments = [...enrollments, ...program.Enrollments];
        }
      });
    }
    
    // Add user's direct enrollments if any
    if (this.user.Enrollments) {
      enrollments = [...enrollments, ...this.user.Enrollments];
    }
    
    // Apply search filter if there is a search term
    if (this.searchTerm.trim()) {
      const searchLower = this.searchTerm.toLowerCase();
      return enrollments.filter(enrollment => 
        enrollment.Patient?.FullName.toLowerCase().includes(searchLower) ||
        enrollment.Program?.ProgramName.toLowerCase().includes(searchLower) ||
        enrollment.Status.toLowerCase().includes(searchLower)
      );
    }
    
    return enrollments;
  }

  // Filter activity based on selected filter
  filteredActivity(): any[] {
    if (this.activityFilter === 'all') {
      return this.activityList;
    }
    
    return this.activityList.filter(activity => activity.type === this.activityFilter);
  }

  // Password visibility toggle
  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  // Edit profile
  editProfile(): void {
    this.setActiveTab('settings');
    this.showToaster('Edit your profile information', 'success');
  }

  // Load user settings into form
  loadUserSettings(): void {
    this.settingsForm = {
      fullName: this.user.FullName,
      email: this.user.Email,
      phone: this.user.Phone,
      role: this.user.Role || 'Staff',
      password: '',
      confirmPassword: ''
    };
  }

  // Reset settings form
  resetForm(): void {
    this.loadUserSettings();
    this.showToaster('Changes discarded', 'success');
  }

  // Save settings
  saveSettings(): void {
    // Validate password match if changing password
    if (this.settingsForm.password && this.settingsForm.password !== this.settingsForm.confirmPassword) {
      this.showToaster('Passwords do not match', 'error');
      return;
    }
    
    this.confirmationModalTitle = 'Save Changes';
    this.confirmationModalMessage = 'Are you sure you want to save these changes to your profile?';
    this.pendingAction = () => {
      // Here you would typically call a service to update the user
      this.user.FullName = this.settingsForm.fullName;
      this.user.Email = this.settingsForm.email;
      this.user.Phone = this.settingsForm.phone;
      this.user.Role = this.settingsForm.role;
      
      if (this.settingsForm.password) {
        this.user.Password = this.settingsForm.password;
      }
      
      this.showToaster('Profile updated successfully', 'success');
    };
    this.showConfirmationModal = true;
  }

  // Confirmation modal methods
  closeConfirmationModal(): void {
    this.showConfirmationModal = false;
    this.pendingAction = null;
  }

  confirmAction(): void {
    if (this.pendingAction) {
      this.pendingAction();
    }
    this.closeConfirmationModal();
  }

  // Toast notification methods
  showToaster(message: string, type: 'success' | 'error'): void {
    this.toastMessage = message;
    this.toastType = type;
    this.showToast = true;
    
    // Auto-hide toast after 3 seconds
    setTimeout(() => {
      this.closeToast();
    }, 3000);
  }

  closeToast(): void {
    this.showToast = false;
  }

  // Generate dummy data for demonstration
  getDummyUserData(): User {
    const now = new Date();
    const twoMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 2, now.getDate());
    
    // Create patients
    const patients: Patient[] = [
      {
        PatientId: '1',
        FullName: 'John Smith',
        Phone: '555-123-4567',
        Email: 'john.smith@example.com',
        DateOfBirth: new Date(1985, 5, 15),
        NationalId: 'AB123456',
        DateCreated: new Date(now.getFullYear(), now.getMonth() - 1, 15)
      },
      {
        PatientId: '2',
        FullName: 'Sarah Johnson',
        Phone: '555-765-4321',
        Email: 'sarah.j@example.com',
        DateOfBirth: new Date(1990, 8, 22),
        NationalId: 'CD789012',
        DateCreated: new Date(now.getFullYear(), now.getMonth() - 1, 10)
      },
      {
        PatientId: '3',
        FullName: 'Robert Wilson',
        Phone: '555-987-6543',
        Email: 'robert.w@example.com',
        DateOfBirth: new Date(1978, 3, 5),
        NationalId: 'EF345678',
        DateCreated: new Date(now.getFullYear(), now.getMonth(), 5)
      }
    ];
    
    // Create programs
    const programs: Program[] = [
      {
        ProgramId: '1',
        ProgramName: 'Diabetes Management',
        Description: 'A comprehensive program for managing diabetes through regular monitoring and lifestyle adjustments.',
        DateCreated: new Date(now.getFullYear(), now.getMonth() - 1, 20),
        DateModified: new Date(now.getFullYear(), now.getMonth(), 2),
        CreatedByUserId: '1',
        Enrollments: [
          {
            EnrollmentId: '1',
            PatientId: '1',
            ProgramId: '1',
            EnrolledByUserId: '1',
            DateCreated: new Date(now.getFullYear(), now.getMonth() - 1, 22),
            Status: 'Active',
            Patient: patients[0]
          },
          {
            EnrollmentId: '2',
            PatientId: '2',
            ProgramId: '1',
            EnrolledByUserId: '1',
            DateCreated: new Date(now.getFullYear(), now.getMonth() - 1, 25),
            Status: 'Pending',
            Patient: patients[1]
          }
        ]
      },
      {
        ProgramId: '2',
        ProgramName: 'Hypertension Management',
        Description: 'Program focused on blood pressure control and cardiovascular health improvement.',
        DateCreated: new Date(now.getFullYear(), now.getMonth(), 5),
        DateModified: new Date(now.getFullYear(), now.getMonth(), 5),
        CreatedByUserId: '1',
        Enrollments: [
          {
            EnrollmentId: '3',
            PatientId: '3',
            ProgramId: '2',
            EnrolledByUserId: '1',
            DateCreated: new Date(now.getFullYear(), now.getMonth(), 7),
            Status: 'Active',
            Patient: patients[2]
          }
        ]
      },
      {
        ProgramId: '3',
        ProgramName: 'COVID-19 Vaccination',
        Description: 'Vaccination program for COVID-19 prevention and monitoring of post-vaccination symptoms.',
        DateCreated: new Date(now.getFullYear(), now.getMonth(), 10),
        DateModified: new Date(now.getFullYear(), now.getMonth(), 12),
        CreatedByUserId: '1',
        Enrollments: []
      }
    ];
    
    // Add program references to enrollments
    programs[0].Enrollments![0].Program = programs[0];
    programs[0].Enrollments![1].Program = programs[0];
    programs[1].Enrollments![0].Program = programs[1];
    
    // Create user with references
    const user: User = {
      UserId: '1',
      FullName: 'Dr. Michael Chen',
      Email: 'michael.chen@assistantdoc.com',
      Phone: '555-987-1234',
      Password: 'hashedPassword',
      Role: 'Doctor',
      IsWelcomed: true,
      DateCreated: twoMonthsAgo,
      ProgramsCreated: programs,
      Enrollments: []
    };
    
    // Set created by reference
    programs.forEach(program => {
      program.CreatedBy = user;
    });
    
    // Set enrolled by reference
    programs[0].Enrollments![0].EnrolledBy = user;
    programs[0].Enrollments![1].EnrolledBy = user;
    programs[1].Enrollments![0].EnrolledBy = user;
    
    return user;
  }
}
