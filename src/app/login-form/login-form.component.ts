import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { throwError, catchError } from 'rxjs';
import { environment } from '../../environments/environment.development';
import { RegistrationResponse } from '../definitions';

@Component({
  selector: 'app-login-form',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './login-form.component.html'
})
export class LoginFormComponent {

  constructor(private http: HttpClient) { }
  public errors = {
    Email: []
  }

  profileForm = new FormGroup({
    email: new FormControl(''),
    password: new FormControl('')
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
      .post<RegistrationResponse>(environment.API_URL + "/account/login", this.profileForm.value)
      .pipe(catchError(this.handleError.bind(this)))
      .subscribe(res => this.setSession(res));
  }
}
