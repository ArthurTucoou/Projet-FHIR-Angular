import { AbstractControl, ValidationErrors } from '@angular/forms';

export function frenchPhoneValidator(control: AbstractControl): ValidationErrors | null {
  const value = control.value;

  // Accepte : 06XXXXXXXX, +336XXXXXXXX, 00336XXXXXXXX (et même les fixes : 01, 02, ...)
  const regex = /^(?:\+33|0033|0)[1-9](\d{8})$/;

  if (!value) return null;

  return regex.test(value) ? null : { invalidPhone: true };
}
