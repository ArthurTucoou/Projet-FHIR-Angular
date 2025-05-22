import { Routes } from '@angular/router';
import { BureauEntreesComponent }        from './bureau-entrees/bureau-entrees.component';
import { PatientListComponent }          from './components/patient-list/patient-list.component';
import { FormulairePatientComponent }    from './formulaire-patient/formulaire-patient.component';

export const routes: Routes = [
  {
    path: '',
    component: BureauEntreesComponent,
    children: [
      // par défaut, redirige vers liste-patients
      { path: '', redirectTo: 'liste-patients', pathMatch: 'full' },
      { path: 'liste-patients', component: PatientListComponent },
      { path: 'ajout-patient',   component: FormulairePatientComponent },
      // fallback
      { path: '**', redirectTo: 'liste-patients' }
    ]
  }
];
