import { CommonModule } from '@angular/common';
import { Component, HostListener, OnInit } from '@angular/core';
import { Router, NavigationEnd, RouterLink, RouterOutlet } from '@angular/router';
import { filter } from 'rxjs';
import { NotificationType, User } from '../../interfaces/assist.doc.interfaces';
import { UserService } from '../../services/user.service';
import { NotificationComponent } from "../notification/notification.component";
import { NotificationService } from '../../services/modal/notification.service';

interface MenuItem {
  id: string;
  title: string;
  icon: string;
  route?: string;
  isOpen?: boolean;
  dropdownItems?: {
    title: string;
    icon: string;
    route: string;
  }[];
}

@Component({
  selector: 'app-doctor',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterOutlet, NotificationComponent],
  templateUrl: './doctor.component.html',
  styleUrl: './doctor.component.css'
})
export class DoctorComponent implements OnInit {
  mobileMenuOpen: boolean = false;
  userMenuOpen: boolean = false;
  currentRoute: string = '';
  user?: User;
  
  // Fallback guest user for when data isn't loaded
  guestUser: User = {
    FullName: 'Guest User',
    Role: 'Visitor',
    UserId: '',
    Email: '',
    Phone: '',
    Password: '',
    IsWelcomed: false,
    DateCreated: new Date()
  };
  
  notifications: number = 3;
  
  // Menu structure for easier management
  menuItems: MenuItem[] = [
    {
      id: 'clients',
      title: 'Clients',
      icon: 'bx-user-plus',
      isOpen: false,
      dropdownItems: [
        { title: 'Register Client', icon: 'bx-user-plus', route: '/doctor/patients' },
        { title: 'Search Clients', icon: 'bx-search', route: '/clients/patients' },
        { title: 'Dashboard', icon: 'bx-list-ul', route: '/doctor/dashboard' }
      ]
    },
    {
      id: 'programs',
      title: 'Programs',
      icon: 'bx-plus-medical',
      isOpen: false,
      dropdownItems: [
        { title: 'Create Program', icon: 'bx-plus-circle', route: '/doctor/programs' },
        { title: 'Manage Programs', icon: 'bx-list-ul', route: '/doctor/programs' }
      ]
    },
    {
      id: 'enrollments',
      title: 'Enrollments',
      icon: 'bx-link',
      isOpen: false,
      dropdownItems: [
        { title: 'Enroll Client', icon: 'bx-user-check', route: '/doctor/enrollments' },
        { title: 'Manage Enrollments', icon: 'bx-edit', route: '/doctor/enrollments' }
      ]
    },
    {
      id: 'api',
      title: 'API',
      icon: 'bx-code-alt',
      route: '/doctor/patients'
    },
    {
      id: 'dashboard',
      title: 'Dashboard',
      icon: 'bx-home-alt',
      route: '/doctor/dashboard'
    }
  ];
  
  constructor(private router: Router, private userService: UserService, private ns: NotificationService) {
    // Subscribe to router events to update active links
    this.router.events.pipe(
      filter((event): event is NavigationEnd => event instanceof NavigationEnd)
    ).subscribe((event: NavigationEnd) => {
      this.currentRoute = event.url;
      // Close mobile menu on navigation
      this.closeMobileMenu();
      // Close all dropdown menus
      this.closeAllMenus();
      this.userMenuOpen = false;
    });
  }
  
  ngOnInit(): void {
    // Add listener for screen resize
    this.handleScreenResize();
    this.fetchUserData();
  }
  
  fetchUserData(): void {
    this.userService.getUserById().subscribe({
      next: (response) => {
        if (response.success && response.object) {
          this.user = response.object;
        } else {
          console.warn('Using fallback guest user');
          this.user = this.guestUser;
        }
      },
      error: (error) => {
        console.warn('Error fetching user data. Using fallback guest user');
        this.user = this.guestUser;
      }
    });
  }

  logoutUser() {
    this.userService.logoutUser().subscribe({
      next: (response) => {
        if (response.success) {
          this.ns.showAlert({
            notificationType: NotificationType.Success,
            message: response.message,
            title: 'Success'
          });

          setTimeout(() => {
            this.router.navigate(['/login']);
          }, 5500);
        }
      },
      error: (err) => {
        this.ns.showAlert({
          notificationType: NotificationType.Success,
          message: err.error.message,
          title: err.error.error as string
        });
      },
    })
  }
  
  // Toggle mobile menu
  toggleMobileMenu(): void {
    this.mobileMenuOpen = !this.mobileMenuOpen;
    // Close user menu when mobile menu is toggled
    this.userMenuOpen = false;
    // Toggle body scroll
    this.toggleBodyScroll(this.mobileMenuOpen);
  }
  
  // Toggle user dropdown menu
  toggleUserMenu(event: Event): void {
    event.stopPropagation();
    this.userMenuOpen = !this.userMenuOpen;
    // Close dropdown menus when user menu is opened
    if (this.userMenuOpen) {
      this.closeAllMenus();
    }
  }
  
  // Toggle dropdown menu
  toggleDropdown(menuId: string): void {
    // Close other dropdowns first
    this.menuItems.forEach(item => {
      if (item.id !== menuId) {
        item.isOpen = false;
      }
    });
    
    // Toggle the clicked dropdown
    const menuItem = this.menuItems.find(item => item.id === menuId);
    if (menuItem) {
      menuItem.isOpen = !menuItem.isOpen;
    }
    
    // Close user menu
    this.userMenuOpen = false;
  }
  
  // Toggle mobile dropdown menu
  toggleMobileDropdown(menuId: string): void {
    const menuItem = this.menuItems.find(item => item.id === menuId);
    if (menuItem) {
      menuItem.isOpen = !menuItem.isOpen;
    }
  }
  
  // Close mobile menu
  closeMobileMenu(): void {
    if (this.mobileMenuOpen) {
      this.mobileMenuOpen = false;
      this.toggleBodyScroll(false);
    }
  }
  
  // Close all dropdown menus
  closeAllMenus(): void {
    this.menuItems.forEach(item => {
      item.isOpen = false;
    });
  }
  
  // Toggle body scroll when mobile menu is open
  private toggleBodyScroll(disable: boolean): void {
    if (disable) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
  }
  
  // Check if route is active
  isRouteActive(route?: string): boolean {
    if (!route) return false;
    return this.currentRoute.includes(route);
  }
  
  // Handle clicks outside menus
  @HostListener('document:click')
  onDocumentClick(): void {
    this.userMenuOpen = false;
    // Don't close dropdown menus on document click when on mobile
    if (window.innerWidth >= 992) {
      this.closeAllMenus();
    }
  }
  
  // Handle screen resize
  @HostListener('window:resize')
  handleScreenResize(): void {
    if (window.innerWidth >= 992 && this.mobileMenuOpen) {
      this.closeMobileMenu();
    }
  }
  
  // Get user avatar with fallback
  getUserAvatar(): string {
    const name = this.user?.FullName || 'Guest User';
    return `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=4e6af0&color=fff`;
  }
  
  // Get user display name with fallback
  get displayName(): string {
    return this.user?.FullName || 'Guest User';
  }
  
  // Get user display role with fallback
  get displayRole(): string {
    return this.user?.Role || 'Visitor';
  }
}