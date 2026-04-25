import { Component, inject, OnInit, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';

import { AuthService } from './core/services/auth-service/auth-service';
import { UserService } from './core/services/user-service/user-service';
import { PulseLoader } from './shared/components/loaders/pulse-loader/pulse-loader';
import { SpinnerLoader } from './shared/components/loaders/spinner-loader/spinner-loader';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, SpinnerLoader, PulseLoader],
  styleUrl: './app.scss',
  template: `
    @if (isReady()) {
      <router-outlet></router-outlet>
    } @else {
      @if (loaderType === 'pulse') {
        <app-pulse-loader></app-pulse-loader>
      } @else {
        <app-spinner-loader></app-spinner-loader>
      }
    }
  `,
})
export class App implements OnInit {
  private authService = inject(AuthService);
  private userService = inject(UserService);

  isReady = signal(false);

  // verifica a rota atual e distingue entre qual loader utilizar
  get loaderType(): 'pulse' | 'spinner' {
    const path = window.location.pathname;
    const publicPaths = ['/', '/register', '/forgot-password']; // rotas cujo loader deve ser o pulse
    return publicPaths.includes(path) ? 'pulse' : 'spinner';
  }

  // verifica se o usuário já está logado na inicialização do app
  ngOnInit() {
    this.authService.verifySession().subscribe({
      next: (user) => {
        this.userService.setUserData(user);
        this.isReady.set(true);
      },
      error: () => {
        this.userService.clearUser();
        this.isReady.set(true);
      },
    });
  }
}
