import { Component, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';

import { CardBody } from '../../../shared/components/card-body/card-body';
import { InputGroup } from '../../../shared/components/input-group/input-group';
import { AuthService } from '../../../core/services/auth-service';
import { UserService } from '../../../core/services/user-service';

@Component({
  selector: 'app-reset-password',
  imports: [CardBody, InputGroup, ReactiveFormsModule],
  templateUrl: './reset-password.html',
  styleUrl: './reset-password.scss',
})
export class ResetPassword {
  private formBuilder = inject(NonNullableFormBuilder);
  private authService = inject(AuthService);
  private userService = inject(UserService);
  private router = inject(Router);

  isLoading = signal(false);

  // definindo o formulário reativo
  form = this.formBuilder.group({
    password: ['', [Validators.required, Validators.minLength(8)]],
    confirm_password: ['', [Validators.required]],
  });

  onResetSubmit(): void {
    const email = this.userService.resetEmail();

    if (!email) {
      alert('Session expired. Request a new code!');
      this.router.navigate(['/forgot-password']);
      return;
    }

    if (this.form.invalid) {
      this.form.markAllAsTouched(); // faz aparecer as mensagens de erro nos inputs
      return;
    }

    const formData = this.form.getRawValue();

    if (formData.confirm_password !== formData.password) {
      alert('Passwords must match each other');
      return;
    }

    this.isLoading.set(true);

    this.authService.resetPassword(email, formData).subscribe({
      next: () => {
        this.userService.setResetEmail(null);
        alert('Password changed successfully!');
        this.router.navigate(['/']); // leva para a página de login
      },
      error: (err) => {
        alert(err.error?.message || "Something didn't work! Try again.");
      },
      complete: () => this.isLoading.set(false),
    });
  }
}
