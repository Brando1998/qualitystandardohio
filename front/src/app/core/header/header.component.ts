import { NgIf } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [NgIf],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent {
  @Input() currentStep!: number;
  
  @Output() prevStep = new EventEmitter<void>();

  onPrevStep() {
    this.prevStep.emit();  // Emitir el evento
  }
}
