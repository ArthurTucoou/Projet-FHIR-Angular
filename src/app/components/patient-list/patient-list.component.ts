import { Component, inject, OnInit } from '@angular/core';
import { FhirService } from '../../services/fhir.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatIconModule } from '@angular/material/icon';
import { Router } from '@angular/router';
import { RouterOutlet } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-patient-list',
  imports: [MatIconModule, RouterOutlet, MatCardModule, MatButtonModule],
  templateUrl: './patient-list.component.html',
  styleUrls: ['./patient-list.component.scss']
})
export class PatientListComponent implements OnInit {
  patients: any[] = [];
  isLoading = true;
  errorMessage = '';

  private fhirService = inject(FhirService);
  private snackBar = inject(MatSnackBar);
  private router = inject(Router);

  ngOnInit(): void {
    this.fhirService.getAllPatients().subscribe({
      next: (response) => {
        this.patients = response.entry?.map((e: any) => e.resource) || [];
        this.isLoading = false;
      },
      error: (error) => {
        this.errorMessage = 'Erreur lors du chargement des patients.';
        this.isLoading = false;
      }
    });
  }

  deletePatient(patientId: string) {
    if (window.confirm('Voulez-vous vraiment supprimer ce patient ?')) {
      this.fhirService.deletePatient(patientId).subscribe({
        next: () => {
          this.patients = this.patients.filter(p => p.id !== patientId); // Met à jour la liste localement
          this.snackBar.open('Patient supprimé avec succès', 'Fermer', { duration: 3000 });
        },
        error: (error) => {
          this.snackBar.open('Erreur lors de la suppression', 'Fermer', { duration: 3000 });
          console.error(error);
        }
      });
    }
  }

  redirectToDetailPatient(patientId: string) {
    this.router.navigate([`/bureau/patients/${patientId}`]);
  }
}
