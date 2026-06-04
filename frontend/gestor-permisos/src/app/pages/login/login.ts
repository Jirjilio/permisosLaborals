  import { Component } from '@angular/core';
  import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
  import { Router } from '@angular/router';
  import { Auth } from '../../services/auth';

  @Component({
    selector: 'app-login',
    standalone: true,
    imports: [ReactiveFormsModule],
    templateUrl: './login.html',
    styleUrls: ['./login.scss'],
  })
  export class Login {
    loginForm: FormGroup;
    errorMessage = '';
    loading = false;

    constructor(private fb: FormBuilder, private auth: Auth, private router: Router) {
      this.loginForm = this.fb.group({
        usuari: ['', Validators.required],
        password: ['', Validators.required],
      });
    }

    onSubmit(): void {
      this.errorMessage = '';

      if (this.loginForm.invalid) {
        this.errorMessage = 'Introdueix usuari i password.';
        return;
      }

      const usuari = String(this.loginForm.value.usuari ?? '').trim();
      const password = String(this.loginForm.value.password ?? '').trim();

      if (!usuari || !password) {
        this.errorMessage = 'Introdueix usuari i password.';
        return;
      }

      this.loading = true;
      console.log('Login.onSubmit: iniciando login para', usuari);

      this.auth.login(usuari, password).subscribe({
        next: (user) => {
          console.log('Login.onSubmit: respuesta de Auth.login ->', user);
          this.loading = false;

          if (!user) {
            this.auth.clearSession();
            this.errorMessage = 'Usuari o password incorrectes.';
            return;
          }

          this.auth.setSession(user);

          const rol = String(user.rol ?? '').toLowerCase();

          if (rol === 'admin') {
            this.router.navigate(['/dashboard']);
            return;
          }

          if (rol === 'basic' || rol === 'user') {
            this.router.navigate(['/permisos']);
            return;
          }

          this.router.navigate(['/login']);
        },
        error: (error) => {
          this.loading = false;
          console.error('Login error:', error);
          this.errorMessage = 'No es pot connectar amb el servidor JSON.';
        },
      });
    }
  }
