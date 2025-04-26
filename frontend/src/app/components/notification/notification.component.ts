import { Component, EventEmitter, OnDestroy, OnInit, Output } from '@angular/core';
import { NotificationType } from '../../interfaces/assist.doc.interfaces';
import { CommonModule } from '@angular/common';
import { NotificationService } from '../../services/modal/notification.service';

@Component({
  selector: 'app-notification',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './notification.component.html',
  styleUrl: './notification.component.css'
})
export class NotificationComponent implements OnInit, OnDestroy {
  notificationType: string = '';
  message: string = '';
  title: string = '';
  autoDismiss: boolean = true;
  dismissTime: number = 5000;
  showIcon: boolean = true;
  
  visible: boolean = false;
  progressWidth: number = 100;
  
  private dismissTimeout: any;
  private progressInterval: any;

  @Output() dismissed = new EventEmitter<void>();
  
  constructor(private ns: NotificationService) { }

  ngOnInit(): void {
    this.ns.notificationData$.subscribe((next) => {
      if(next) {
        if(next?.title) {
          this.notificationType = next.notificationType;
          this.title = next.title;
          this.message = next.message;
          this.performEntryOrExit();
        } else {
          this.notificationType = next.notificationType;
          this.message = next.message;
          this.performEntryOrExit();
        }
      }
    })
  }
  
  ngOnDestroy(): void {
    this.clearTimers();
  }

  performEntryOrExit(): void {

    setTimeout(() => {
      this.visible = true;
      
      if (this.autoDismiss) {
        this.startProgressBar();
        this.dismissTimeout = setTimeout(() => {
          this.closeNotification();
        }, this.dismissTime);
      }
    }, 100);
  }
  
  closeNotification(): void {
    this.visible = false;
    this.ns.cancelAlert();
    this.clearTimers();
    
    setTimeout(() => {
      this.dismissed.emit();
    }, 500);
  }
  
  getNotificationIcon(): string {
    switch (this.notificationType) {
      case 'success':
        return 'fa fa-check-circle';
      case 'error':
        return 'fa fa-exclamation-circle';
      case 'info':
        return 'fa fa-info-circle';
      case 'warning':
        return 'fa fa-exclamation-triangle';
      default:
        return 'fa fa-bell';
    }
  }
  
  getNotificationTitle(): string {
    if (this.title) {
      return this.title;
    }
    
    switch (this.notificationType) {
      case 'success':
        return 'Success';
      case 'error':
        return 'Error';
      case 'info':
        return 'Information';
      case 'warning':
        return 'Warning';
      default:
        return 'Notification';
    }
  }
  
  showTitle(): boolean {
    return this.notificationType === 'error' || !!this.title;
  }
  
  private startProgressBar(): void {
    const updateInterval = 10; // Update progress every 10ms
    const steps = this.dismissTime / updateInterval;
    const decrementAmount = 100 / steps;
    
    this.progressWidth = 100;
    
    this.progressInterval = setInterval(() => {
      this.progressWidth -= decrementAmount;
      
      if (this.progressWidth <= 0) {
        clearInterval(this.progressInterval);
      }
    }, updateInterval);
  }
  
  private clearTimers(): void {
    if (this.dismissTimeout) {
      clearTimeout(this.dismissTimeout);
    }
    
    if (this.progressInterval) {
      clearInterval(this.progressInterval);
    }
  }
}