import { computed, Injectable, signal } from '@angular/core';

export interface UserData {
  id: string;
  name: string;
  email: string;
  isAccountVerified: boolean;
}

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private userState = signal<UserData | null>(null);

  // expondo os dados apenas para leitura
  userData = this.userState.asReadonly();

  firstName = computed(() => this.userData()?.name.split(' ')[0] || 'User');
  firstNameLetter = computed(() => this.firstName()[0].toUpperCase());
  isVerified = computed(() => !!this.userData()?.isAccountVerified);

  setUserData(data: UserData | null) {
    this.userState.set(data);
  }

  clearUser() {
    this.setUserData(null);
  }

  resetEmail = signal<string | null>(sessionStorage.getItem('reset_email'));

  setResetEmail(email: string | null) {
    // garante que o e-mail seja recuperável mesmo após um F5
    if (email) sessionStorage.setItem('reset_email', email);
    else sessionStorage.removeItem('reset_email');

    this.resetEmail.set(email);
  }
}
