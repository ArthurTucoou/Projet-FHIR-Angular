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
import { Nationalite } from '../../Models/nationalite';

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

  countries: Nationalite[] = [
    { code: 'FR', display: 'France' },
    { code: 'DE', display: 'Allemagne' },
    { code: 'IT', display: 'Italie' },
    { code: 'ES', display: 'Espagne' },
    { code: 'TN', display: 'Tunisie' },
    { code: 'MA', display: 'Maroc' },
    { code: 'DZ', display: 'Algérie' },
    { code: 'PT', display: 'Portugal' },
    { code: 'GB', display: 'Royaume-Uni' },
    { code: 'US', display: 'États-Unis' },
    { code: 'CA', display: 'Canada' },
    { code: 'BR', display: 'Brésil' },
    { code: 'TR', display: 'Turquie' },
    { code: 'CN', display: 'Chine' },
    { code: 'IN', display: 'Inde' },
    { code: 'JP', display: 'Japon' },
    { code: 'SN', display: 'Sénégal' },
    { code: 'CI', display: "Côte d'Ivoire" },
    { code: 'BE', display: 'Belgique' },
    { code: 'CH', display: 'Suisse' }
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
    nationalite: [new Nationalite(), Validators.required],
    contactUrgenceNom: ['', Validators.required],
    contactUrgencePrenom: ['', Validators.required],
    contactUrgenceTel: ['', Validators.required],
    identifiantMedical: ['', Validators.required],
  });

  onSubmit(): void {
    if (this.form.invalid) return;

    const formValue = this.form.value;

    const patientResource = {
      resourceType: "Patient",
      identifier: [
        {
          use: "official",
          type: {
            coding: [
              {
                system: "http://terminology.hl7.org/CodeSystem/v2-0203",
                code: "NNSSA",
                display: "Numéro National de Santé"
              }
            ]
          },
          system: "http://fhir.fr/CodeSystem/identifiant-national-patient",
          value: formValue.identifiantMedical,
          assigner: {
            display: "Assurance Maladie"
          },
          extension: [
            {
              url: "https://hl7.fr/ig/fhir/core/StructureDefinition/fr-core-patient-identifier",
              valueBoolean: true
            }
          ]
        }
      ],
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
        coding: [{
          system: "http://terminology.hl7.org/CodeSystem/v3-MaritalStatus",
          code: formValue.etatCivil?.code ?? '',
          display: formValue.etatCivil?.display ?? ''
        }],
        text: formValue.etatCivil?.display ?? ''
      },
      extension: [
        {
          url: 'https://hl7.fr/ig/fhir/core/StructureDefinition/fr-core-patient-nationality',
          valueCodeableConcept: {
            coding: [{
              system: 'urn:iso:std:iso:3166',
              code: formValue.nationalite?.code,
              display: formValue.nationalite?.display
            }]
          }
        },
        {
          url: "https://hl7.fr/ig/fhir/core/StructureDefinition/fr-core-birthPlace",
          valueAddress: {
            city: formValue.lieuNaissance
          }
        }
      ],
      contact: [
        {
          relationship: [
            {
              coding: [
                {
                  system: "http://terminology.hl7.org/CodeSystem/v2-0131",
                  code: "E",
                  display: "Emergency Contact"
                }
              ],
              text: "Contact d'urgence"
            }
          ],
          name: {
            family: formValue.contactUrgenceNom,
            given: [formValue.contactUrgencePrenom]
          },
          telecom: [
            {
              system: "phone",
              value: formValue.contactUrgenceTel,
              use: "mobile"
            }
          ]
        }
      ]
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
