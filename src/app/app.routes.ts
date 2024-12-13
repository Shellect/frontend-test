import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { RegistrationFormComponent } from './registration-form/registration-form.component';

export const routes: Routes = [
    { path: "", component: HomeComponent},
    { path: "registration", component: RegistrationFormComponent}
];
