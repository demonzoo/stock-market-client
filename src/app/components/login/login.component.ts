import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../core/auth/auth.service';
import { Router } from '@angular/router';
import { ResponseEntity } from '../../models/response-entity';

interface LoginData {
  token: string;
  userId: number;
  role: string;
  email: string;
}

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  public loginForm: FormGroup;
  public alertMsg = '';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) { }

  submitForm(): void {
    for (const key of Object.keys(this.loginForm.controls)) {
      this.loginForm.controls[key].markAsDirty();
      this.loginForm.controls[key].updateValueAndValidity();
    }

    const email = this.loginForm.get('email');
    const password = this.loginForm.get('password');
    if (email.dirty && email.errors && email.errors.required) {
      this.alertMsg = 'Please input your email address!';
    } else if (password.dirty && password.errors) {
      this.alertMsg = 'Please input your password!';
    }

    if (this.loginForm.valid) {
      this.authService.login({
        email: this.loginForm.value.email,
        password: this.loginForm.value.password
      }).subscribe((loginRes: ResponseEntity<LoginData>) => {
        // Set token first
        sessionStorage.setItem('token', loginRes.data.token);

        // Then get extra user information
        this.authService.getUser();

        // Navigate to home page
        this.router.navigate(['/']);

    //
      }, error => {
        this.loginForm.get('email').setErrors(Validators.nullValidator);
      });
    }
  }

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      email: [ 'admin@stockmarket.com', [ Validators.required ] ],
      password: [ null, [ Validators.required ] ],
      remember: [ true ]
    });
  }

}
