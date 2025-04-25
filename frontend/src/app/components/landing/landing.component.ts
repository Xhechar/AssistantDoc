import { CommonModule } from '@angular/common';
import { Component, HostListener, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-landing',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './landing.component.html',
  styleUrl: './landing.component.css'
})
export class LandingComponent implements OnInit {
  isMobileNavActive: boolean = false;
  isLoginModalActive: boolean = false;
  isSignupModalActive: boolean = false;
  activeTestimonialIndex: number = 0;

  constructor() { }

  ngOnInit(): void {
    this.initAnimations();
  }

  // Header scroll effect
  @HostListener('window:scroll', ['$event'])
  onWindowScroll() {
    const header = document.querySelector('header') as HTMLElement;
    
    if (window.scrollY > 50) {
      header.style.padding = '0.7rem 5%';
      header.style.boxShadow = '0 2px 15px rgba(0, 0, 0, 0.1)';
    } else {
      header.style.padding = '1rem 5%';
      header.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.1)';
    }
  }

  // Mobile navigation toggle
  toggleMobileNav(): void {
    this.isMobileNavActive = !this.isMobileNavActive;
    document.body.style.overflow = this.isMobileNavActive ? 'hidden' : '';
  }

  closeMobileNav(): void {
    this.isMobileNavActive = false;
    document.body.style.overflow = '';
  }

  // Modal controls
  openLoginModal(): void {
    this.isLoginModalActive = true;
    document.body.style.overflow = 'hidden';
  }

  openSignupModal(): void {
    this.isSignupModalActive = true;
    document.body.style.overflow = 'hidden';
  }

  closeModals(): void {
    this.isLoginModalActive = false;
    this.isSignupModalActive = false;
    document.body.style.overflow = '';
  }

  // Testimonial slider
  changeTestimonial(index: number): void {
    this.activeTestimonialIndex = index;
  }

  // Animation initialization
  private initAnimations(): void {
    // Add animation classes to elements that should animate on page load
    const revealElements = document.querySelectorAll('.reveal-text, .reveal-image, .fade-in, .slide-in-right');
    
    // Create an Intersection Observer to trigger animations when elements become visible
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          // Add animation class if it was removed
          if (entry.target.classList.contains('reveal-text-hidden')) {
            entry.target.classList.remove('reveal-text-hidden');
            entry.target.classList.add('reveal-text');
          }
          if (entry.target.classList.contains('reveal-image-hidden')) {
            entry.target.classList.remove('reveal-image-hidden');
            entry.target.classList.add('reveal-image');
          }
          if (entry.target.classList.contains('fade-in-hidden')) {
            entry.target.classList.remove('fade-in-hidden');
            entry.target.classList.add('fade-in');
          }
          if (entry.target.classList.contains('slide-in-right-hidden')) {
            entry.target.classList.remove('slide-in-right-hidden');
            entry.target.classList.add('slide-in-right');
          }
          // Stop observing once animation is triggered
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 });

    // Start observing elements
    revealElements.forEach(element => {
      observer.observe(element);
    });
  }

  // Smooth scroll to section when navigation link is clicked
  scrollToSection(sectionId: string): void {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      this.closeMobileNav();
    }
  }

  // Form submissions (to be implemented with your backend)
  submitLoginForm(event: Event): void {
    event.preventDefault();
    // Implement your login logic here
    console.log('Login form submitted');
    // After successful login
    // this.closeModals();
  }

  submitSignupForm(event: Event): void {
    event.preventDefault();
    // Implement your signup logic here
    console.log('Signup form submitted');
    // After successful signup
    // this.closeModals();
  }
}
