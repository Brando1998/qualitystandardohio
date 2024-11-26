import { NgIf } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-alert',
  standalone: true,
  imports: [NgIf],
  templateUrl: './alert.component.html',
  styleUrl: './alert.component.css'
})
export class AlertComponent {
  @Input() data: any; // Objeto que contiene los detalles del ítem
  @Input() isVisible: boolean = false; // Controla la visibilidad del modal

  closeModal() {
    this.isVisible = false; // Cierra el modal
  }
}
