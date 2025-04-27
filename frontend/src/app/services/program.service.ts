import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CreateProgramDto, UpdateProgramDto } from '../interfaces/assist.doc.dtos';
import { ServiceResponse, Program } from '../interfaces/assist.doc.interfaces';

@Injectable({
  providedIn: 'root'
})
export class ProgramService {
  getPrograms() {
    throw new Error('Method not implemented.');
  }

  API_URL: string = 'http://localhost:3000/programs/';

  constructor(private http: HttpClient) { }

  createProgram(dto: CreateProgramDto): Observable<ServiceResponse<null>> {
    return this.http.post<ServiceResponse<null>>(
      `${this.API_URL}createProgram`,
      dto,
      { withCredentials: true }
    );
  }

  updateProgram(programId: string, updatedDetails: UpdateProgramDto): Observable<ServiceResponse<null>> {
    return this.http.put<ServiceResponse<null>>(
      `${this.API_URL}updateProgram/${programId}`,
      updatedDetails,
      { withCredentials: true }
    );
  }

  deleteProgram(programId: string): Observable<ServiceResponse<null>> {
    return this.http.delete<ServiceResponse<null>>(
      `${this.API_URL}deleteProgram/${programId}`,
      { withCredentials: true }
    );
  }

  getProgramById(programId: string): Observable<ServiceResponse<Program>> {
    return this.http.get<ServiceResponse<Program>>(
      `${this.API_URL}getProgramById/${programId}`,
      { withCredentials: true }
    );
  }

  getAllPrograms(): Observable<ServiceResponse<Program>> {
    return this.http.get<ServiceResponse<Program>>(
      `${this.API_URL}getAllPrograms`,
      { withCredentials: true }
    );
  }
}
