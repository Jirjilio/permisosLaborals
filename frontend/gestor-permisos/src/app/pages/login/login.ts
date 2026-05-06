import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Auth } from '../../services/auth';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './login.html',
  styleUrl: './login.scss',
})
export class Login {
  loginForm: FormGroup;

  constructor(private fb: FormBuilder, private auth: Auth, private router: Router) {
    this.loginForm = this.fb.group({
      usuari: ['', Validators.required],
      password: ['', Validators.required],
    });
  }

  onSubmit() {
    if (!this.loginForm.valid) {
      return;
    }

    const { usuari, password } = this.loginForm.value;

    this.auth.login(usuari ?? '', password ?? '').subscribe(user => {
      if (!user) {
        console.log('Invalid credentials');
        return;
      }

      console.log('Login successful:', user);
      localStorage.setItem('user', JSON.stringify(user));

      if (user.rol === 'admin') {
        this.router.navigate(['/dashboard']);
        return;
      }

      if (user.rol === 'basic') {
        this.router.navigate(['/permisos']);
        return;
      }

      this.router.navigate(['/login']);
    });
  }
}
