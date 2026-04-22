import { Component } from '@angular/core';
import {FormBuilder, FormGroup, Validators, ReactiveFormsModule}  from '@angular/forms';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule],
  templateUrl: './login.html',
  styleUrl: './login.scss',
})
export class Login {
  loginForm: FormGroup;

  constructor(private fb: FormBuilder) {
    this.loginForm = this.fb.group({
  usuari: ['', Validators.required],
  password: ['', Validators.required]
});
}
  onSubmit() {
    if (this.loginForm.valid) {
      console.log(this.loginForm.value);
    }
  }


}
