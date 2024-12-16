import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { environment } from '../../environments/environment.development';
import { catchError, throwError } from 'rxjs';
import { RegistrationResponse } from '../definitions';

@Component({
  selector: 'app-registration-form',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './registration-form.component.html',
  styleUrl: './registration-form.component.scss'
})
export class RegistrationFormComponent {

  constructor(private http: HttpClient) { }
  public errors = {
    Email: [],
    Login: [],
    BirthDay: [],
    Password: []
  }


  profileForm = new FormGroup({
    email: new FormControl(''),
    login: new FormControl(''),
    birthDay: new FormControl(''),
    password: new FormControl(''),
    confirmPassword: new FormControl('')
  });

  private handleError(response: HttpErrorResponse) {
    if (response.status === 400) {
      this.errors = response.error.errors;
    }
    return throwError(() => response.error);
  }

  private setSession(res: RegistrationResponse) {
    localStorage.setItem('id_token', res.token);
  }

  onSubmit() {
    this.http
      .post<RegistrationResponse>(environment.API_URL + "/account/registration", this.profileForm.value)
      .pipe(catchError(this.handleError.bind(this)))
      .subscribe(res => this.setSession(res));
  }
}
