import { Component, Input } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-redirect-action',
  imports: [RouterLink],
  templateUrl: './redirect-action.html',
  styleUrl: './redirect-action.scss',
})
export class RedirectAction {
  @Input() text: string = '';
  @Input() linkText: string = '';
  @Input() to: string = '';
}
