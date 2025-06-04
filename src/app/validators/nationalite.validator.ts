import { AbstractControl, ValidationErrors } from '@angular/forms';

export function nationaliteFranceValidator(control: AbstractControl): ValidationErrors | null {
    const value = control.value;
    // Si la nationalité est définie et que le display ou le code est différent de "France", invalide
    if (value) {
        const display = value.display;
        const code = value.code;
        if (display !== 'France' && code !== 'FR') {
            return { notFrance: true };
        }
    }

    return null; // valide
}
