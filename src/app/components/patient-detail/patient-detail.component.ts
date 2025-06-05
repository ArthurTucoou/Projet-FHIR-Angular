import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FhirService } from '../../services/fhir.service';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';
import { Participant } from '../../Models/participant';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';

@Component({
  selector: 'app-patient-detail',
  imports: [
    CommonModule,
    MatIconModule,
    MatTableModule,
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    MatCardModule,
    MatChipsModule
  ],
  templateUrl: './patient-detail.component.html',
  styleUrl: './patient-detail.component.scss'
})
export class PatientDetailComponent implements OnInit {
  patientId!: string;
  patient: any;
  appointments: any[] = [];
  isLoading = true;
  searchTerm: string = "";
  columnsToDisplay = ['date', 'description', 'medecin', 'localisation', 'status'];

  private route = inject(ActivatedRoute);
  private fhirService = inject(FhirService);

  ngOnInit(): void {
    this.patientId = this.route.snapshot.paramMap.get('id')!;
    this.loadPatientDetails();
  }

  loadPatientDetails() {
    this.isLoading = true;
    this.fhirService.getPatientById(this.patientId).subscribe({
      next: (data) => {
        this.patient = data;

        this.fhirService?.getAppointmentsByPatientId(this.patientId).subscribe({
          next: (rdvs) => {
            this.appointments = rdvs;
            this.appointments?.forEach(appointment => {
              const participants: Participant[] = appointment.participant || [];

              // Récupérer références
              const practitionerRef = participants.find(p =>
                p.actor?.reference?.startsWith('Practitioner/')
              )?.actor.reference;


              const locationRef = participants.find(p =>
                p.actor?.reference?.startsWith('Location/')
              )?.actor.reference;

              // Init labels à 'Chargement...'
              appointment.practitionerLabel = 'Chargement...';
              appointment.locationLabel = 'Chargement...';

              // Récupérer practitioner si référence disponible
              if (practitionerRef) {
                this.fhirService.getResourceByReference(practitionerRef).subscribe({
                  next: (practitioner) => {
                    // Supposons que practitioner.name[0].text ou display contient le nom
                    const name = practitioner.name && practitioner.name.length > 0
                      ? practitioner?.name[0]?.family + ' ' + practitioner?.name[0].given[0]
                      : 'Nom non trouvé';
                    appointment.practitionerLabel = name;
                  },
                  error: () => appointment.practitionerLabel = 'Non trouvé'
                });
              } else {
                appointment.practitionerLabel = 'Non renseigné';
              }

              // Récupérer location si référence disponible
              if (locationRef) {
                this.fhirService.getResourceByReference(locationRef).subscribe({
                  next: (location) => {
                    // location.name contient souvent le nom
                    appointment.locationLabel = location.name || 'Nom non trouvé';
                  },
                  error: () => appointment.locationLabel = 'Non trouvé'
                });
              } else {
                appointment.locationLabel = 'Non renseigné';
              }
            });

            this.isLoading = false;
          },
          error: () => {
            this.appointments = [];
            this.isLoading = false;
          }
        });
      },
      error: () => {
        this.isLoading = false;
      }
    });
  }

}
