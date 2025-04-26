import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { SuccessMessage } from '../../interfaces/assist.doc.interfaces';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  constructor() { }

  private notificationData = new BehaviorSubject<SuccessMessage | null>(null);

  notificationData$: Observable<SuccessMessage | null> = this.notificationData.asObservable();

  showAlert(notificationData: SuccessMessage) {
    this.notificationData.next(notificationData);
  }

  cancelAlert() {
    this.notificationData.next(null);
  }
}
