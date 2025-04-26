import { Component, OnInit } from '@angular/core';
import { LoginDetails } from '../../interfaces/assist.doc.interfaces';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent implements OnInit {
  loginModel: LoginDetails = {
    Email: '',
    Password: ''
  };
  
  rememberMe: boolean = false;
  showPassword: boolean = false;
  
  constructor() { }

  ngOnInit(): void {
  }
  
  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }
  
  onSubmit(formValue: any): void {
    console.log('Login form submitted:', formValue);
    console.log('Remember me:', this.rememberMe);
    // Here you would typically send the data to your backend API
    // For example:
    // this.authService.login(this.loginModel).subscribe(
    //   (response) => {
    //     // Handle successful login
    //     // Store token, redirect to dashboard, etc.
    //   },
    //   (error) => {
    //     // Handle login error
    //   }
    // );
  }
}