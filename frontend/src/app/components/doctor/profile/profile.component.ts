import { Component, OnInit } from '@angular/core';
import { Enrollment, NotificationType, User } from '../../../interfaces/assist.doc.interfaces';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { NotificationService } from '../../../services/modal/notification.service';
import { UserService } from '../../../services/user.service';
import { NotificationComponent } from "../../notification/notification.component";
import { UpdateUserDto } from '../../../interfaces/assist.doc.dtos';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, FormsModule, NotificationComponent],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css'
})
export class ProfileComponent implements OnInit {
  // User data
  user: User = {
    UserId: '',
    FullName: '',
    Email: '',
    Phone: '',
    Password: '',
    Role: '',
    IsWelcomed: false,
    DateCreated: new Date(),
    ProgramsCreated: [],
    Enrollments: []
  };
  
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
  
  // Activity data
  activityList: { type: string, icon: string, title: string, description: string, date: Date }[] = [];
  
  // Settings form
  settingsForm = {
    fullName: '',
    email: '',
    phone: '',
    role: '',
    password: '',
    confirmPassword: ''
  };

  constructor(
    private userService: UserService,
    private ns: NotificationService
  ) {}

  ngOnInit(): void {
    this.loadUserProfile();
  }

  // Load user profile from API
  loadUserProfile(): void {
    this.userService.getUserById().subscribe({
      next: (response) => {
        if (response.success && response.object) {
          this.user = response.object;
          this.loadUserSettings();
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
          message: error.error.message as string,
          title: error.error.error as string
        });
      }
    });
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
    this.ns.showAlert({
      notificationType: NotificationType.Info,
      message: 'Edit your profile information',
      title: 'Profile Edit'
    });
  }

  // Load user settings into form
  loadUserSettings(): void {
    this.userService.getUserById().subscribe({
      next: (response) => {
        if (response.success && response.object) {
          this.settingsForm = {
            fullName: response.object.FullName,
            email: response.object.Email,
            phone: response.object.Phone,
            role: response.object.Role,
            password: '',
            confirmPassword: ''
          };
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
          message: error.error.message as string || 'Failed to load user settings',
          title: error.error.error as string
        });
      }
    });
  }

  // Reset settings form
  resetForm(): void {
    this.loadUserSettings();
    this.ns.showAlert({
      notificationType: NotificationType.Info,
      message: 'Changes discarded',
      title: 'Success'
    });
  }

  // Save settings
  saveSettings(): void {
    // Validate password match if changing password
    if (this.settingsForm.password && this.settingsForm.password !== this.settingsForm.confirmPassword) {
      this.ns.showAlert({
        notificationType: NotificationType.Error,
        message: 'Passwords do not match',
        title: 'Credentials Error'
      });
      return;
    }

    if (this.settingsForm.password == ''.trim()) {
      this.ns.showAlert({
        notificationType: NotificationType.Info,
        message: 'Password not provided.',
        title: 'Credentials Error'
      });
      return;
    }
    
    this.confirmationModalTitle = 'Save Changes';
    this.confirmationModalMessage = 'Are you sure you want to save these changes to your profile?';
    this.pendingAction = () => {
      const updatedUser: UpdateUserDto = {
        FullName: this.settingsForm.fullName,
        Email: this.settingsForm.email,
        Phone: this.settingsForm.phone
      };
      
      this.userService.updateUser(updatedUser).subscribe({
        next: (response) => {
          if (response.success && response.object) {
            this.user = response.object;
            this.loadUserSettings();
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
            message: error.error.message as string,
            title: error.error.error as string
          });
        }
      });
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
}
