import { Component, EventEmitter, Input, Output } from '@angular/core';
import { LucideAngularModule } from 'lucide-angular';

@Component({
  selector: 'app-menu',
  imports: [LucideAngularModule],
  templateUrl: './menu.html',
  styleUrl: './menu.scss',
})
export class Menu {
  @Input() firstName: string = '';
  @Input() firstNameLetter: string = '';

  // emissor de eventos
  @Output() onLogoutRequest = new EventEmitter<void>();

  handleClickLogOut(): void {
    this.onLogoutRequest.emit(); // avisa para o componente pai que houve um clique
  }
}
