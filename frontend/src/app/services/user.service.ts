import { Injectable } from '@angular/core';
import { LoginDetails, ServiceResponse, User } from '../interfaces/assist.doc.interfaces';
import { LoginUserDto, RegisterUserDto, UpdateUserDto } from '../interfaces/assist.doc.dtos';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  API_URL: string = 'http://localhost:3000/user/';

  constructor(private http: HttpClient) { }

  registerUser(userDetails: RegisterUserDto): Observable<ServiceResponse<null>> {
    return this.http.post<ServiceResponse<null>>(
      `${this.API_URL}register`,
      userDetails,
      { withCredentials: true }
    );
  }

  loginUser(loginDetails: LoginUserDto): Observable<ServiceResponse<null>> {
    return this.http.post<ServiceResponse<null>>(
      `${this.API_URL}login`,
      loginDetails,
      { withCredentials: true }
    );
  }

  getUserById(): Observable<ServiceResponse<User>> {
    return this.http.get<ServiceResponse<User>>(
      `${this.API_URL}getUserById`,
      { withCredentials: true }
    );
  }

  updateUser(updatedDetails: UpdateUserDto): Observable<ServiceResponse<null>> {
    return this.http.put<ServiceResponse<null>>(
      `${this.API_URL}updateUser`,
      updatedDetails,
      { withCredentials: true }
    );
  }

  deleteUser(userId: string): Observable<ServiceResponse<null>> {
    return this.http.delete<ServiceResponse<null>>(
      `${this.API_URL}deleteUser/${userId}`,
      { withCredentials: true }
    );
  }
}
