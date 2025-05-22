import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FhirService } from '../../services/fhir.service';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-patient-detail',
  imports: [
    CommonModule,
    MatIconModule,
    MatTableModule,
    MatFormFieldModule,
    MatInputModule,
    FormsModule
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

  private route = inject(ActivatedRoute);
  private fhirService = inject(FhirService);

  get filteredAppointments() {
    return this.appointments.filter(rdv =>
      !this.searchTerm ||
      rdv.status.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
      (rdv.start && new Date(rdv.start).toLocaleDateString().includes(this.searchTerm))
    );
  }


  ngOnInit(): void {
    this.patientId = this.route.snapshot.paramMap.get('id')!;
    this.loadPatientDetails();
  }

  loadPatientDetails() {
    this.isLoading = true;
    this.fhirService.getPatientById(this.patientId).subscribe({
      next: (data) => {
        this.patient = data;
        console.log(this.patient);
        
        this.fhirService.getAppointmentsByPatientId(this.patientId).subscribe({
          next: (rdvs) => {
            this.appointments = rdvs;
            console.log(this.appointments);

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
