import { Component } from '@angular/core';

@Component({
  selector: 'app-pulse-loader',
  imports: [],
  template: `
    <div class="loader">
      <img src="assets/images/logoipsum_full.png" alt="Loading..." class="loader__logo" />
    </div>
  `,
  styleUrl: './pulse-loader.scss',
})
export class PulseLoader {}
