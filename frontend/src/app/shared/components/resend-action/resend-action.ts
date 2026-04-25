import { Component, EventEmitter, Input, OnDestroy, Output, signal } from '@angular/core';

@Component({
  selector: 'app-resend-action',
  imports: [],
  templateUrl: './resend-action.html',
  styleUrl: './resend-action.scss',
})
export class ResendAction implements OnDestroy {
  @Input() type: 'VERIFY' | 'RESET' = 'VERIFY';
  @Output() onResend = new EventEmitter<void>();

  isResending = signal(false);
  timer = signal(0);
  private intervalId: any;

  // limpa o timer quando o usuário navega para outra página
  ngOnDestroy(): void {
    this.clearTimer();
  }

  handleResend(): void {
    if (this.timer() > 0 || this.isResending()) return;
    this.onResend.emit();
  }

  setResending(state: boolean) {
    this.isResending.set(state);
  }

  startTimer() {
    this.timer.set(60);
    this.clearTimer();

    this.intervalId = setInterval(() => {
      if (this.timer() > 0) {
        this.timer.update((value) => value - 1);
      } else {
        this.clearTimer();
      }
    }, 1000);
  }

  clearTimer() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
  }
}
