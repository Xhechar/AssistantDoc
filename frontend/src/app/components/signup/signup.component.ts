import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RegisterUserDto } from '../../interfaces/assist.doc.dtos';
import { NgForm, FormsModule } from '@angular/forms';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.css'
})
export class SignupComponent implements OnInit {
  // Form model based on the DTO
  user: RegisterUserDto = {
    FullName: '',
    Email: '',
    Phone: '',
    Password: ''
  };

  confirmPassword: string = '';
  acceptTerms: boolean = false;
  
  showPassword: boolean = false;
  showConfirmPassword: boolean = false;
  
  formSubmitted: boolean = false;

  constructor() { }

  ngOnInit(): void {
  }

  // Toggle password visibility
  togglePasswordVisibility(field: 'password' | 'confirm'): void {
    if (field === 'password') {
      this.showPassword = !this.showPassword;
    } else {
      this.showConfirmPassword = !this.showConfirmPassword;
    }
  }

  // Form submission handler
  onSubmit(form: NgForm): void {
    this.formSubmitted = true;
    
    if (form.valid && this.user.Password === this.confirmPassword && this.acceptTerms) {
      console.log('Form submitted successfully', this.user);
      
      // Here you would typically call your registration service
      // this.authService.register(this.user).subscribe(...)
      
      // Reset form after successful submission (optional)
      this.resetForm(form);
    } else {
      console.log('Form has errors, please check');
    }
  }

  // Reset form fields
  private resetForm(form: NgForm): void {
    form.resetForm();
    this.user = {
      FullName: '',
      Email: '',
      Phone: '',
      Password: ''
    };
    this.confirmPassword = '';
    this.acceptTerms = false;
    this.formSubmitted = false;
  }
}
