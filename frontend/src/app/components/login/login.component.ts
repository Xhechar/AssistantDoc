import { Component, OnInit } from '@angular/core';
import { LoginDetails, NotificationType, SuccessMessage } from '../../interfaces/assist.doc.interfaces';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { UserService } from '../../services/user.service';
import { NotificationService } from '../../services/modal/notification.service';
import { NotificationComponent } from '../notification/notification.component';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, NotificationComponent],
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
  
  constructor(private us: UserService, private ns: NotificationService, private router: Router) { }

  ngOnInit(): void {
  }
  
  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }
  
  onSubmit(): void {
    let ns = this.ns;
    let router = this.router;
    this.us.loginUser(this.loginModel).subscribe({
      next(response) {
        if (response.success) {
          ns.showAlert({
            notificationType: NotificationType.Success,
            message: response.message,
            title: undefined
          });

          if (response.role == 'Doctor') {
            setTimeout(() => {
                router.navigate(['/doctor']);
              }, 4000);
          }          
        } else {
            ns.showAlert({notificationType: NotificationType.Warning, message: response.message, title: response.error as string});
          }
      },
        error: (error) => {
          this.ns.showAlert({notificationType: NotificationType.Error, message: error.error.message as string, title: 'Internal Server Error'});
        }
    })
  }
}