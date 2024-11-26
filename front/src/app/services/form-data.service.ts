import { Injectable } from '@angular/core';
import { LocalStorageService } from './localstorage.service';

@Injectable({
  providedIn: 'root'
})
export class FormDataService {
  private storageKey = 'multiStepFormData';

  constructor(
    private localStorageService: LocalStorageService
  ) { }

  // Guarda o actualiza una sección específica del formulario en localStorage
  saveStepData(step: string, data: any): void {
    const allData = this.getAllFormData() || {};
    allData[step] = data;
    this.localStorageService.setItem(this.storageKey, JSON.stringify(allData));
  }

  // Obtiene los datos de una sección específica del formulario
  getStepData(step: string): any {
    const allData = this.getAllFormData();
    return allData ? allData[step] : null;
  }

  // Obtiene todos los datos del formulario completo
  getAllFormData(): any {
    const savedData = this.localStorageService.getItem(this.storageKey);
    return savedData ? JSON.parse(savedData) : null;
  }

  // Limpia los datos del almacenamiento local
  clearFormData(): void {
    this.localStorageService.removeItem(this.storageKey);
  }
}
