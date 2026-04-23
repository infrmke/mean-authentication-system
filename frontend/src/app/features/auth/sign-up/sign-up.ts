import { Component, inject, signal } from '@angular/core';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

import { CardBody } from '../../../shared/components/card-body/card-body';
import { InputGroup } from '../../../shared/components/input-group/input-group';
import { RedirectAction } from '../../../shared/components/redirect-action/redirect-action';
import { AuthService } from '../../../core/services/auth-service';
import { UserService } from '../../../core/services/user-service';

@Component({
  selector: 'app-sign-up',
  imports: [CardBody, InputGroup, RedirectAction, ReactiveFormsModule],
  templateUrl: './sign-up.html',
  styleUrl: './sign-up.scss',
})
export class SignUp {
  private formBuilder = inject(NonNullableFormBuilder);
  private authService = inject(AuthService);
  private userService = inject(UserService);
  private router = inject(Router);

  private toastr = inject(ToastrService);

  isLoading = signal(false);

  // definindo o formulário reativo
  form = this.formBuilder.group({
    name: ['', [Validators.required, Validators.minLength(2)]],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(8)]],
    confirm_password: ['', [Validators.required]],
  });

  onRegisterSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched(); // faz aparecer as mensagens de erro nos inputs
      return;
    }

    const formData = this.form.getRawValue();

    if (formData.confirm_password !== formData.password) {
      this.toastr.error('Passwords must match each other');
      return;
    }

    this.isLoading.set(true);

    this.authService.register(formData).subscribe({
      next: (user) => {
        this.userService.setUserData(user);
        this.router.navigate(['/home']);
      },
      error: (err) => {
        this.isLoading.set(false);
        this.toastr.error(err.error?.message || "Something didn't work! Try again.");
      },
      complete: () => this.isLoading.set(false),
    });
  }
}
