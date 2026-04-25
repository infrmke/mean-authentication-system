import { Component, computed, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-error-page',
  imports: [RouterLink],
  templateUrl: './error-page.html',
  styleUrl: './error-page.scss',
})
export class ErrorPage {
  private router = inject(Router);

  errorStatus = computed(() => {
    const nav = this.router.currentNavigation();
    return nav?.extras?.state?.['error'] || '404 - Not Found';
  });
}
