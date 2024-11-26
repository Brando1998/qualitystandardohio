import { DatePipe, NgClass, NgIf } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { CalendarComponent } from '../calendar/calendar.component';

@Component({
  selector: 'app-client-request-service-step-5',
  standalone: true,
  imports: [
    NgIf,
    CalendarComponent,
    DatePipe,
    NgClass
  ],
  templateUrl: './client-request-service-step-5.component.html',
  styleUrl: './client-request-service-step-5.component.css'
})
export class ClientRequestServiceStep5Component {
  @Output() nextStep = new EventEmitter<any>();
  @Input() stepData!: string | null;
  selectedFrequency: string | null = null;
  dateTime: { 
    date: Date | null; 
    time: string; 
    week: any | null; 
    frequency: string | null 
  } | null = null;

  step5Form = new FormGroup({
    frequency: new FormControl<{ date: Date | null; time: string; week: any | null; frequency: string | null } | null>(null, Validators.required),
  });

  ngOnInit(): void {
    if (this.stepData) {
      this.dateTime = JSON.parse(this.stepData).frequency;
      this.selectedFrequency = this.dateTime!.frequency
      this.step5Form.patchValue(JSON.parse(this.stepData))
    }
  }

  selectFrequency(frequency: string) {
    this.selectedFrequency = null;
    setTimeout(()=>{
      this.selectedFrequency = frequency;
    },500)
  }

  updateFrequency(dateTime: { date: Date | null; time: string; week: any | null; frequency: string | null } | null) {
    // console.log(dateTime)
    // console.log(this.selectedFrequency)
    if (dateTime) {
      dateTime.frequency = this.selectedFrequency;
      this.step5Form.controls.frequency.setValue(dateTime);
      this.dateTime = dateTime;
    }
  }

  onNextStep() {
    const frequencyFormValue = this.step5Form.controls.frequency.value
    if (this.step5Form.valid && frequencyFormValue?.time) {
      this.nextStep.emit(this.step5Form.value);
    }
  }
}
