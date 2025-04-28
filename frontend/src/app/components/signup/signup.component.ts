import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RegisterUserDto } from '../../interfaces/assist.doc.dtos';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { NotificationService } from '../../services/modal/notification.service';
import { UserService } from '../../services/user.service';
import { NotificationType } from '../../interfaces/assist.doc.interfaces';
import { NotificationComponent } from "../notification/notification.component";

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, NotificationComponent],
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
  
  constructor(private ns: NotificationService, private us: UserService) { }

  ngOnInit(): void {
  }
  
  togglePasswordVisibility(field: string): void {
    if (field === 'password') {
      this.showPassword = !this.showPassword;
    } else if (field === 'confirm') {
      this.showConfirmPassword = !this.showConfirmPassword;
    }
  }
  
  onSubmit(): void {
    this.us.registerUser(this.registerModel).subscribe({
      next: (response) => {
        if (response.success) {
          this.ns.showAlert({
            notificationType: NotificationType.Success,
            message: response.message,
            title: 'Success'
          });
          setTimeout(() => {
            window.location.href = '/login';
          }, 5500);
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
          message: error.error as string,
          title: error.error.error as string
        });
      }
    });

  }
}