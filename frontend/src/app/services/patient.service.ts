import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { RegisterPatientDto, UpdatePatientDto } from '../interfaces/assist.doc.dtos';
import { ServiceResponse, Patient } from '../interfaces/assist.doc.interfaces';

@Injectable({
  providedIn: 'root'
})
export class PatientService {

  API_URL: string = 'http://localhost:3000/patients/';

  constructor(private http: HttpClient) { }

  registerPatient(patientDetails: RegisterPatientDto): Observable<ServiceResponse<null>> {
    return this.http.post<ServiceResponse<null>>(
      `${this.API_URL}registerPatient`,
      patientDetails,
      { withCredentials: true }
    );
  }

  updatePatient(patientId: string, updatedDetails: UpdatePatientDto): Observable<ServiceResponse<null>> {
    return this.http.put<ServiceResponse<null>>(
      `${this.API_URL}updatePatient/${patientId}`,
      updatedDetails,
      { withCredentials: true }
    );
  }

  deletePatient(patientId: string): Observable<ServiceResponse<null>> {
    return this.http.delete<ServiceResponse<null>>(
      `${this.API_URL}deletePatient/${patientId}`,
      { withCredentials: true }
    );
  }

  getPatientById(patientId: string): Observable<ServiceResponse<Patient>> {
    return this.http.get<ServiceResponse<Patient>>(
      `${this.API_URL}getPatientById/${patientId}`,
      { withCredentials: true }
    );
  }

  getAllPatients(): Observable<ServiceResponse<Patient>> {
    return this.http.get<ServiceResponse<Patient>>(
      `${this.API_URL}getAllPatients`,
      { withCredentials: true }
    );
  }
}
