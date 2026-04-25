import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-user-section',
  imports: [],
  templateUrl: './user-section.html',
  styleUrl: './user-section.scss',
})
export class UserSection {
  @Input() title: string = '';
  @Input() subtitle: string = '';
  @Input() description: string = '';
}
