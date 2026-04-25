import { Component } from '@angular/core';

@Component({
  selector: 'app-spinner-loader',
  imports: [],
  template: '<div class="spinner" role="status" aria-label="Loading..."></div>',
  styleUrl: './spinner-loader.scss',
})
export class SpinnerLoader {}
