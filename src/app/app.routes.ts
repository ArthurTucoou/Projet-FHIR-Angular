import { Routes } from '@angular/router';
import { PatientListComponent } from './components/patient-list/patient-list.component';
import { BureauEntreesComponent } from './bureau-entrees/bureau-entrees.component';
import { FormulairePatientComponent } from './formulaire-patient/formulaire-patient.component';
import { PatientDetailComponent } from './patient-detail/patient-detail.component';

export const routes: Routes = [
    { path: "", component: BureauEntreesComponent },
    { path: "liste-patients", component: PatientListComponent },
    { path: "ajout-patient", component: FormulairePatientComponent },
    { path: 'patients/:id', component: PatientDetailComponent }
];
