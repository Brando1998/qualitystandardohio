import { NgIf } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, NgIf],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  loginForm: FormGroup;
  errorMessage: string | null = null;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      username: ['', [Validators.required]],
      password: ['', [Validators.required]]
    });
  }

  ngOnInit(): void {
    // Redirige al dashboard si el usuario ya está autenticado
    if (this.authService.isLoggedIn()) {
      this.router.navigate(['admin/dash']);
    }
  }

  onSubmit(): void {
    if (this.loginForm.valid) {
      this.authService.login(this.loginForm.value).subscribe({
        next: (response) => {
          // Maneja la respuesta del servidor
          console.log('Login successful', response);
          this.router.navigate(['admin/dash']);
        },
        error: (error) => {
          this.errorMessage = 'Incorrect credentials. Please try again.';
          console.error('Login Error', error.error.detail);
        }
      });
    }
  }
}
