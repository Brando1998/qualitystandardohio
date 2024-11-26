import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-client-request-service-step-2',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './client-request-service-step-2.component.html',
  styleUrl: './client-request-service-step-2.component.css',
})
export class ClientRequestServiceStep2Component implements OnInit {
  @Output() nextStep = new EventEmitter<any>();
  @Input() stepData!: string | null;

  step2Form = new FormGroup({
    name: new FormControl('', Validators.required),
    email: new FormControl('', Validators.required),
    phone: new FormControl('', Validators.required),
    address: new FormControl('', Validators.required),
  });

  ngOnInit(): void {
    if (this.stepData) {
      this.step2Form.patchValue(JSON.parse(this.stepData))
    }
  }

  onNextStep() {
    if (this.step2Form.valid) {
      this.nextStep.emit(this.step2Form.value);
    }
  }
}
