import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatRadioModule } from '@angular/material/radio';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { FhirService } from '../../services/fhir.service';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { MaritalStatus } from '../../Models/martialStatus';
import { Address } from '../../Models/address';

@Component({
  selector: 'app-formulaire-patient',
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatRadioModule,
    MatButtonModule,
    MatSnackBarModule,
    MatCardModule
  ],
  templateUrl: './formulaire-patient.component.html',
  styleUrl: './formulaire-patient.component.scss'
})
export class FormulairePatientComponent {
  private fb = inject(FormBuilder);
  private fhirService = inject(FhirService);
  private snackBar = inject(MatSnackBar);
  private router = inject(Router);

  etatsCivil: MaritalStatus[] = [
    { code: 'S', display: 'Célibataire' },
    { code: 'M', display: 'Marié(e)' },
    { code: 'D', display: 'Divorcé(e)' },
    { code: 'W', display: 'Veuf(ve)' },
    { code: 'T', display: 'Partenaire' },
    { code: 'L', display: 'Séparé(e)' },
    { code: 'UNK', display: 'Inconnu' }
  ];

  form = this.fb.group({
    nom: ['', Validators.required],
    prenom: ['', Validators.required],
    dateNaissance: ['', Validators.required],
    lieuNaissance: ['', Validators.required],
    telephone: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    adresse: ['', Validators.required],
    etatCivil: [new MaritalStatus(), Validators.required],
    genre: ['', Validators.required],
    contactUrgenceNom: ['', Validators.required],
    contactUrgencePrenom: ['', Validators.required],
    contactUrgenceTel: ['', Validators.required],
    identifiantMedical: ['', Validators.required],
    nationalite: ['', Validators.required],
  });

  onSubmit(): void {
    if (this.form.invalid) return;

    const formValue = this.form.value;

    const addressBirth = new Address();
    addressBirth.text = formValue.lieuNaissance ?? '';

    const patientResource = {
      resourceType: "Patient",
      name: [{
        family: formValue.nom,
        given: [formValue.prenom]
      }],
      birthDate: formValue.dateNaissance,
      gender: formValue.genre,
      telecom: [
        { system: "phone", value: formValue.telephone },
        { system: "email", value: formValue.email }
      ],
      address: [{
        text: formValue.adresse
      }],
      maritalStatus: {
        code: formValue.etatCivil?.code ?? '',
        display: formValue.etatCivil?.display ?? ''
      },
      birthPlace: addressBirth
    };

    this.fhirService.createPatient(patientResource).subscribe({
      next: (patient) => {
        this.snackBar.open('Patient ' + formValue.nom + ' ' + formValue.prenom + ' ajouté avec succès ✅', 'Fermer', {
          duration: 3000
        });
        this.router.navigate(['/bureau/liste-patients']);
        console.log(patient);
      },
      error: err => {
        console.error(err);
        this.snackBar.open('Erreur lors de l\'ajout du patient ❌', 'Fermer', {
          duration: 4000
        });
      }
    });
  }

}
