import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  Output,
  QueryList,
  signal,
  ViewChildren,
} from '@angular/core';

@Component({
  selector: 'app-otp-input',
  imports: [],
  templateUrl: './otp-input.html',
  styleUrl: './otp-input.scss',
})
export class OtpInput {
  @Input() type: 'VERIFY' | 'RESET' = 'VERIFY';
  @Input() disabled: boolean = false;

  @Output() onOtpChange = new EventEmitter<string>();
  @Output() onOtpSubmit = new EventEmitter<string>();

  // "estado" de erro
  isError = signal(false);

  // pega todos os inputs com a referência #otpInput
  @ViewChildren('otpInput') inputElements!: QueryList<ElementRef<HTMLInputElement>>;

  // "estado" para os 6 dígitos
  otpDigits: string[] = new Array(6).fill('');

  // verifica se todos os inputs foram preenchidos
  get isComplete(): boolean {
    return this.otpDigits.every((digit) => digit !== '');
  }

  // verifica se todos os inputs foram preenchidos e envia o otp
  private submitOtp(): void {
    const fullCode = this.otpDigits.join('');

    if (fullCode.length === 6) {
      this.onOtpSubmit.emit(fullCode);
    }
  }

  // reseta todos os inputs e foca no primeiro
  reset(): void {
    this.otpDigits.fill('');
    this.isError.set(true);
    this.inputElements.get(0)?.nativeElement.focus();
  }

  // evento de input a cada mudança nos inputs
  handleInput(event: Event, index: number): void {
    if (this.isError()) this.isError.set(false); // Limpa o erro ao digitar

    const input = event.target as HTMLInputElement;
    const value = input.value;

    // ignora tudo que não é número
    if (isNaN(Number(value))) {
      input.value = '';
      return;
    }

    // atualiza o estado e avisa ao parente que o estado foi alterado
    this.otpDigits[index] = value;
    this.onOtpChange.emit(this.otpDigits.join(''));

    // move o foco para o próximo input após ser preenchido
    if (value !== '' && index < 5) {
      this.inputElements.get(index + 1)?.nativeElement.focus();
    }

    //  envia o form se todos os campos estiverem preenchidos
    this.submitOtp();
  }

  // evento keydown para a tecla backspace
  handleKeyDown(index: number): void {
    //  move o foco para o input anterior se o usuário estiver apagando o código
    if (!this.otpDigits[index] && index > 0) {
      this.inputElements.get(index - 1)?.nativeElement.focus();
    }

    // atualiza o estado e avisa ao parente que o estado foi alterado
    this.otpDigits[index] = '';
    this.onOtpChange.emit(this.otpDigits.join(''));
  }

  // evento de cola (ctrl+v)
  handlePaste(event: ClipboardEvent): void {
    event.preventDefault();

    const pastedData = event.clipboardData?.getData('text') || '';

    // filtra apenas os primeiros 6 números
    const digits = pastedData.replace(/\D/g, '').split('').slice(0, 6);

    digits.forEach((digit, index) => {
      if (index < 6) {
        this.otpDigits[index] = digit;
      }
    });

    // avisa ao parente que o estado foi alterado
    this.onOtpChange.emit(this.otpDigits.join(''));

    this.submitOtp();
  }
}
