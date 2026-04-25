import { AfterViewInit, Component, ElementRef, Input, ViewChild } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { LucideAngularModule } from 'lucide-angular';

@Component({
  selector: 'app-input-group',
  imports: [LucideAngularModule, ReactiveFormsModule],
  templateUrl: './input-group.html',
  styleUrl: './input-group.scss',
})
export class InputGroup implements AfterViewInit {
  @Input() control!: FormControl;
  @Input() label: string = '';
  @Input() type: string = '';
  @Input() id: string = '';
  @Input() name: string = '';
  @Input() placeholder: string = '';
  @Input() iconName?: string; // nome do ícone no pacote lucide
  @Input() required: boolean = false;
  @Input() autoFocus: boolean = false;

  // pega a referência de #inputElement no input-group.html
  @ViewChild('inputElement') inputRef!: ElementRef<HTMLInputElement>;

  ngAfterViewInit() {
    // se a propriedade autoFocus foi passada como true, o input recebe foco
    if (this.autoFocus) {
      this.inputRef.nativeElement.focus();
    }
  }
}
