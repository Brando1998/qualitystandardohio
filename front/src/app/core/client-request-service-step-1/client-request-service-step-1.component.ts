import { Component, Output, EventEmitter, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-client-request-service-step-1',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './client-request-service-step-1.component.html',
  styleUrl: './client-request-service-step-1.component.css',
})
export class ClientRequestServiceStep1Component implements OnInit {
  @Output() nextStep = new EventEmitter<any>();
  @Input() stepData!: string | null;

  step1Form = new FormGroup({
    acceptTerms: new FormControl(null, Validators.requiredTrue)
  });

  ngOnInit(): void {
    if (this.stepData) {
      this.step1Form.patchValue(JSON.parse(this.stepData))
    }
  }

  onNextStep() {
    if (this.step1Form.valid) {
      this.nextStep.emit(this.step1Form.value);
    }
  }
}
