import { Routes } from '@angular/router';
import { LandingComponent } from './components/landing/landing.component';
import { LoginComponent } from './components/login/login.component';
import { SignupComponent } from './components/signup/signup.component';
import { PatientComponent } from './components/patient/patient.component';
import { DoctorComponent } from './components/doctor/doctor.component';
import { DashboardComponent } from './components/doctor/dashboard/dashboard.component';
import { PatientsComponent } from './components/doctor/patients/patients.component';
import { EnrollmentsComponent } from './components/doctor/enrollments/enrollments.component';
import { ProgramsComponent } from './components/doctor/programs/programs.component';

export const routes: Routes = [
    {path: '', component: LandingComponent},
    {path: 'home', redirectTo: '', pathMatch: 'full'},
    {path: 'login', component: LoginComponent},
    {path: 'register', component: SignupComponent},
    {path: 'patient/:PatientId', component: PatientComponent},
    {path: 'doctor', component: DoctorComponent, children: [
        {path: '', redirectTo: 'dashboard', pathMatch: 'full'},
        {path: 'dashboard', component: DashboardComponent},
        {path: 'patients', component: PatientsComponent},
        {path: 'enrollments', component: EnrollmentsComponent},
        {path: 'programs', component: ProgramsComponent}
    ]}
];
