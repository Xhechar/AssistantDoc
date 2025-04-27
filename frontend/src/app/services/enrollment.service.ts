import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { EnrollPatientDto } from '../interfaces/assist.doc.dtos';
import { ServiceResponse, Enrollment } from '../interfaces/assist.doc.interfaces';

@Injectable({
  providedIn: 'root'
})
export class EnrollmentService {
  getEnrollments() {
    throw new Error('Method not implemented.');
  }

  API_URL: string = 'https://assistant-doc-backend.onrender.com/enrollments/';

  constructor(private http: HttpClient) { }

  enrollPatient(dtos: EnrollPatientDto[]): Observable<ServiceResponse<null>> {
    return this.http.post<ServiceResponse<null>>(
      `${this.API_URL}enrollPatient`,
      {dtos},
      { withCredentials: true }
    );
  }

  toggleEnrollmentStatus(enrollmentId: string): Observable<ServiceResponse<Enrollment>> {
    return this.http.put<ServiceResponse<Enrollment>>(
      `${this.API_URL}toggle-status/${enrollmentId}`,
      {},
      { withCredentials: true }
    );
  }

  deleteEnrollment(enrollmentId: string): Observable<ServiceResponse<null>> {
    return this.http.delete<ServiceResponse<null>>(
      `${this.API_URL}deleteEnrollment/${enrollmentId}`,
      { withCredentials: true }
    );
  }

  getEnrollmentById(enrollmentId: string): Observable<ServiceResponse<Enrollment>> {
    return this.http.get<ServiceResponse<Enrollment>>(
      `${this.API_URL}getEnrollmentById/${enrollmentId}`,
      { withCredentials: true }
    );
  }

  getAllEnrollments(): Observable<ServiceResponse<Enrollment>> {
    return this.http.get<ServiceResponse<Enrollment>>(
      `${this.API_URL}getAllEnrollments`,
      { withCredentials: true }
    );
  }
}
