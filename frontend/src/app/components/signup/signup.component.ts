import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RegisterUserDto } from '../../interfaces/assist.doc.dtos';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.css'
})
export class SignupComponent implements OnInit {
  registerModel: RegisterUserDto = {
    FullName: '',
    Email: '',
    Phone: '',
    Password: ''
  };
  
  confirmPassword: string = '';
  terms: boolean = false;
  showPassword: boolean = false;
  showConfirmPassword: boolean = false;
  
  constructor() { }

  ngOnInit(): void {
  }
  
  togglePasswordVisibility(field: string): void {
    if (field === 'password') {
      this.showPassword = !this.showPassword;
    } else if (field === 'confirm') {
      this.showConfirmPassword = !this.showConfirmPassword;
    }
  }
  
  onSubmit(formValue: any): void {
    
  }
}