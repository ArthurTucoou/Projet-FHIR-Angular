import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatRadioModule } from '@angular/material/radio';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-formulaire-patient',
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatRadioModule,
    MatButtonModule
  ],
  templateUrl: './formulaire-patient.component.html',
  styleUrl: './formulaire-patient.component.scss'
})
export class FormulairePatientComponent {
  private fb = inject(FormBuilder);

  form = this.fb.group({
    nom: ['', Validators.required],
    prenom: ['', Validators.required],
    dateNaissance: ['', Validators.required],
    lieuNaissance: ['', Validators.required],
    telephone: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    adresse: ['', Validators.required],
    etatCivil: ['', Validators.required],
    genre: ['', Validators.required]
  });

  onSubmit() {
    if (this.form.valid) {
      console.log('Patient à ajouter :', this.form.value);
      // Ici : appel au service FHIR ou autre backend
    }
  }
}
