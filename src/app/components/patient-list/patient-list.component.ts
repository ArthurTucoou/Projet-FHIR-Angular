import { Component, inject, OnInit } from '@angular/core';
import { FhirService } from '../../services/fhir.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-patient-list',
  imports: [MatIconModule],
  templateUrl: './patient-list.component.html',
  styleUrls: ['./patient-list.component.scss']
})
export class PatientListComponent implements OnInit {
  patients: any[] = [];
  isLoading = true;
  errorMessage = '';

  private fhirService = inject(FhirService);
  private snackBar = inject(MatSnackBar);

  ngOnInit(): void {
    console.log("tesstt");

    this.fhirService.getAllPatients().subscribe({
      next: (response) => {
        console.log(response);

        this.patients = response.entry?.map((e: any) => e.resource) || [];
        this.isLoading = false;
        console.log(this.isLoading);

      },
      error: (error) => {
        this.errorMessage = 'Erreur lors du chargement des patients.';
        this.isLoading = false;
      }
    });
  }

  deletePatient(id: string) {
    if (window.confirm('Voulez-vous vraiment supprimer ce patient ?')) {
      this.fhirService.deletePatient(id).subscribe({
        next: () => {
          this.patients = this.patients.filter(p => p.id !== id); // Met à jour la liste localement
          this.snackBar.open('Patient supprimé avec succès', 'Fermer', { duration: 3000 });
        },
        error: (error) => {
          this.snackBar.open('Erreur lors de la suppression', 'Fermer', { duration: 3000 });
          console.error(error);
        }
      });
    }

  }
}
