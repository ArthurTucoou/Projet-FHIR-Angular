import { Component, inject, OnInit } from '@angular/core';
import { FhirService } from '../../services/fhir.service';

@Component({
  selector: 'app-patient-list',
  templateUrl: './patient-list.component.html',
  styleUrls: ['./patient-list.component.scss']
})
export class PatientListComponent implements OnInit {
  patients: any[] = [];
  isLoading = true;
  errorMessage = '';

  private fhirService = inject(FhirService);

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
}
