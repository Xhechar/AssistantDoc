import { CommonModule } from '@angular/common';
import { Component, HostListener, OnInit } from '@angular/core';
import { Router, NavigationEnd, RouterLink, RouterEvent, RouterOutlet } from '@angular/router';
import { filter } from 'rxjs';

@Component({
  selector: 'app-doctor',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterOutlet],
  templateUrl: './doctor.component.html',
  styleUrl: './doctor.component.css'
})
export class DoctorComponent implements OnInit {
  mobileMenuOpen: boolean = false;
  userMenuOpen: boolean = false;
  currentRoute: string = '';
  
  constructor(private router: Router) {
    // Subscribe to router events to update active links
    this.router.events.pipe(
      filter((event): event is NavigationEnd => event instanceof NavigationEnd)
    ).subscribe((event: NavigationEnd) => {
      this.currentRoute = event.url;
      // Close mobile menu on navigation
      this.closeMobileMenu();
    });
  }

  ngOnInit(): void {
    // Add listener for screen resize
    this.handleScreenResize();
  }

  // Toggle mobile menu
  toggleMobileMenu(): void {
    this.mobileMenuOpen = !this.mobileMenuOpen;
    // Close user menu when mobile menu is toggled
    if (this.mobileMenuOpen) {
      this.userMenuOpen = false;
    }
    // Toggle body scroll
    this.toggleBodyScroll(this.mobileMenuOpen);
  }

  // Toggle user dropdown menu
  toggleUserMenu(): void {
    this.userMenuOpen = !this.userMenuOpen;
  }

  // Close mobile menu
  closeMobileMenu(): void {
    if (this.mobileMenuOpen) {
      this.mobileMenuOpen = false;
      this.toggleBodyScroll(false);
    }
  }

  // Close user menu when clicked outside
  closeUserMenu(): void {
    this.userMenuOpen = false;
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
  isRouteActive(route: string): boolean {
    return this.currentRoute.includes(route);
  }

  // Handle clicks outside the user menu
  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    const userProfileElement = document.querySelector('.user-profile');
    if (userProfileElement && !userProfileElement.contains(event.target as Node)) {
      this.closeUserMenu();
    }
  }

  // Handle screen resize
  @HostListener('window:resize', ['$event'])
  handleScreenResize(): void {
    if (window.innerWidth >= 992 && this.mobileMenuOpen) {
      this.closeMobileMenu();
    }
  }
}