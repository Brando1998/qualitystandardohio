import { DatePipe, NgFor, NgIf } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-calendar',
  standalone: true,
  imports: [
    DatePipe,
    FormsModule,
    NgIf,
    NgFor
  ],
  templateUrl: './calendar.component.html',
  styleUrl: './calendar.component.css'
})
export class CalendarComponent implements OnInit {
  @Input() frequency: any;
  @Output() dateTimeSelected = new EventEmitter<{ date: Date | null; time: string; week: any | null, frequency: string | null }>();
  daysOfWeek = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
  currentMonth: number;
  currentYear: number;
  currentMonthName!: string;
  calendarDays: (Date | null)[] = [];
  selectedDate: Date | null = null;
  selectedTime: string = '';
  weekOfMonth!: number;

  constructor() {
    const today = new Date();
    this.currentMonth = today.getMonth();
    this.currentYear = today.getFullYear();
    this.updateCalendar();
  }

  ngOnInit(): void {
    console.log(this.frequency)
    if (this.frequency != null) {
      this.selectDate(new Date(this.frequency.date))
      this.selectedTime = this.frequency.time
      this.emitDateTime();
    }
  }

  updateCalendar() {
    this.currentMonthName = new Date(this.currentYear, this.currentMonth).toLocaleString('default', { month: 'long' });
    const firstDayOfMonth = new Date(this.currentYear, this.currentMonth, 1).getDay();
    const daysInMonth = new Date(this.currentYear, this.currentMonth + 1, 0).getDate();

    this.calendarDays = Array(firstDayOfMonth).fill(null);

    for (let day = 1; day <= daysInMonth; day++) {
      this.calendarDays.push(new Date(this.currentYear, this.currentMonth, day));
    }
  }

  prevMonth() {
    this.currentMonth -= 1;
    if (this.currentMonth < 0) {
      this.currentMonth = 11;
      this.currentYear -= 1;
    }
    this.updateCalendar();
  }

  nextMonth() {
    this.currentMonth += 1;
    if (this.currentMonth > 11) {
      this.currentMonth = 0;
      this.currentYear += 1;
    }
    this.updateCalendar();
  }

  selectDate(day: Date) {
    this.selectedDate = day;
    this.emitDateTime();
  }

  isSelected(day: Date | null): boolean {
    return !!(day && this.selectedDate && day.getTime() === this.selectedDate.getTime());
  }

  onTimeChange() {
    this.emitDateTime();
  }

  emitDateTime() {
    if (this.selectedDate) {
      // console.log({ date: this.selectedDate, time: this.selectedTime, week: this.getWeekOfMonth(this.selectedDate), frequency: null })
      this.dateTimeSelected.emit({ date: this.selectedDate, time: this.selectedTime, week: this.getWeekOfMonth(this.selectedDate), frequency: null });
    }
  }

  getWeekOfMonth(date: Date): string {
    const day = date.getDate();
    this.weekOfMonth = Math.ceil(day / 7);
    if (this.weekOfMonth === 1) return 'Every first week';
    else if (this.weekOfMonth === 2) return 'Every second week';
    else if (this.weekOfMonth === 3) return 'Every third week';
    else if (this.weekOfMonth === 4) return 'Every fourth week';
    else return 'Every last week';
  }
}
