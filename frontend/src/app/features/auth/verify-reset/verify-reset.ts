import { Component, inject, signal, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

import { CardBody } from '../../../shared/components/card-body/card-body';
import { OtpInput } from '../../../shared/components/otp-input/otp-input';
import { ResendAction } from '../../../shared/components/resend-action/resend-action';

import { AuthService } from '../../../core/services/auth-service/auth-service';
import { UserService } from '../../../core/services/user-service/user-service';

@Component({
  selector: 'app-verify-reset',
  imports: [CardBody, OtpInput, ResendAction],
  templateUrl: './verify-reset.html',
  styleUrl: './verify-reset.scss',
})
export class VerifyReset {
  private authService = inject(AuthService);
  private userService = inject(UserService);
  private router = inject(Router);

  private toastr = inject(ToastrService);

  @ViewChild(ResendAction) resendAction!: ResendAction;
  @ViewChild(OtpInput) otpInput!: OtpInput;

  isLoading = signal(false);

  // recebe o código
  handleOtpSubmit(otp: string) {
    const email = this.userService.resetEmail();

    if (!email) {
      this.toastr.info('Session expired. Request a new code!');
      this.router.navigate(['/forgot-password']);
      return;
    }

    this.isLoading.set(true);
    this.authService.checkResetOtp(email, otp).subscribe({
      next: () => {
        // leva o usuário para a página de redefinição de senha
        this.router.navigate(['/forgot-password/reset']);
      },
      error: (err) => {
        this.isLoading.set(false);
        this.toastr.error(err.error?.message || 'Invalid code.');
        this.otpInput.reset(); // limpa os campos se o código estiver errado
      },
    });
  }

  // reenvia o código
  handleResend() {
    const email = this.userService.resetEmail();
    if (!email) return;

    this.resendAction.setResending(true);
    this.authService.resendOtp('RESET', email).subscribe({
      next: (res) => {
        this.toastr.success(res.message);
        this.resendAction.startTimer();
      },
      error: (err) => this.toastr.error(err.error?.message || "Something didn't work! Try again."),
      complete: () => this.resendAction.setResending(false),
    });
  }
}
