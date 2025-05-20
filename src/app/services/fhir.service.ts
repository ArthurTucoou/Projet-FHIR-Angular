import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FhirService {
  private apiUrl = 'https://fhir.chl.connected-health.fr/fhir'; // attention au /fhir à la fin
  private http = inject(HttpClient);

  // Récupérer tous les patients (première page)
  getAllPatients(): Observable<any> {
      return this.http.get<any>(`${this.apiUrl}/Patient`, { headers: { 'Accept': 'application/fhir+json' } });
    // return this.http.get(`${this.apiUrl}/Patient`);
  }

  // Récupérer un patient par ID
  getPatientById(id: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/Patient/${id}`);
  }

  // Créer un nouveau patient
  createPatient(patient: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/Patient`, patient);
  }

  // Modifier un patient
  updatePatient(id: string, patient: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/Patient/${id}`, patient);
  }

  // Supprimer un patient
  deletePatient(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/Patient/${id}`);
  }
}
