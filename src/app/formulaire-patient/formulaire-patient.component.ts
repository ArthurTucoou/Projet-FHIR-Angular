import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatRadioModule } from '@angular/material/radio';
import { MatButtonModule } from '@angular/material/button';
import { FhirService } from '../services/fhir.service';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { Router } from '@angular/router';

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
  ],
  templateUrl: './formulaire-patient.component.html',
  styleUrl: './formulaire-patient.component.scss'
})
export class FormulairePatientComponent {
  private fb = inject(FormBuilder);
  private fhirService = inject(FhirService);
  private snackBar = inject(MatSnackBar);
  private router = inject(Router);

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

  onSubmit(): void {
    if (this.form.invalid) return;

    const formValue = this.form.value;

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
      extension: [
        {
          url: "http://hl7.org/fhir/StructureDefinition/patient-birthPlace",
          valueString: formValue.lieuNaissance
        },
        {
          url: "https://hl7.fr/ig/fhir/core/ValueSet/fr-core-vs-marital-status",
          valueString: formValue.etatCivil
        }
      ]
    };

    this.fhirService.createPatient(patientResource).subscribe({
      next: (patient) => {
        this.snackBar.open('Patient ' + formValue.nom + ' ' + formValue.prenom + ' ajouté avec succès ✅', 'Fermer', {
          duration: 3000
        });
        this.router.navigate(['/liste-patients']);
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
