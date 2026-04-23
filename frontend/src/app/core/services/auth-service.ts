import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { UserData } from './user-service';
import { environment } from '../../../environments/environment.development';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private http = inject(HttpClient);
  private readonly API_URL = environment.apiUrl;

  /* resource: /users */
  register(payload: any): Observable<UserData> {
    return this.http.post<UserData>(`${this.API_URL}/users`, payload, {
      withCredentials: true,
    });
  }

  delete(userId: string): Observable<any> {
    return this.http.delete(`${this.API_URL}/users/${userId}`, {
      withCredentials: true,
    });
  }

  /* resource: /sessions */
  verifySession(): Observable<UserData> {
    return this.http.get<UserData>(`${this.API_URL}/sessions/me`, {
      withCredentials: true,
    });
  }

  login(credentials: any): Observable<UserData> {
    return this.http.post<UserData>(`${this.API_URL}/sessions/login`, credentials, {
      withCredentials: true,
    });
  }

  logout(): Observable<any> {
    return this.http.post<UserData>(
      `${this.API_URL}/sessions/logout`,
      {},
      {
        withCredentials: true,
      },
    );
  }

  /* resource: /otps */
  requestPasswordReset(email: string): Observable<any> {
    return this.http.post(`${this.API_URL}/otps/password-reset/request`, { email });
  }

  sendEmailVerificationOtp(userId: string): Observable<any> {
    return this.http.post(`${this.API_URL}/otps/email-verification/${userId}`, {});
  }

  checkEmailOtp(userId: string, otp: string): Observable<any> {
    return this.http.post(`${this.API_URL}/otps/email-verification/check/${userId}`, { otp });
  }

  checkResetOtp(email: string, otp: string): Observable<any> {
    return this.http.post(`${this.API_URL}/otps/password-reset/check/`, { email, otp });
  }

  resetPassword(
    email: string,
    data: { password: string; confirm_password: string },
  ): Observable<any> {
    return this.http.patch(
      `${this.API_URL}/otps/password-reset/`,
      {
        email,
        new_password: data.password,
        confirm_password: data.confirm_password,
      },
      { withCredentials: true },
    );
  }

  resendOtp(type: 'VERIFY' | 'RESET', email?: string): Observable<{ message: string }> {
    const payload: any = { type };

    // para RESET, o e-mail é adicionado ao corpo da requisição
    if (type === 'RESET' && email) {
      payload.email = email;
    }

    return this.http.post<{ message: string }>(`${this.API_URL}/otps/resend`, payload, {
      withCredentials: true,
    });
  }
}
