import { Routes } from '@angular/router';
import { BureauEntreesComponent }        from './bureau-entrees/bureau-entrees.component';
import { PatientListComponent }          from './components/patient-list/patient-list.component';
import { FormulairePatientComponent }    from './formulaire-patient/formulaire-patient.component';
import { AccueilComponent } from './accueil/accueil.component';
import { PatientDetailComponent } from './patient-detail/patient-detail.component';

export const routes: Routes = [
  { path: '', component: AccueilComponent },
  {
    path: 'bureau',
    component: BureauEntreesComponent,
    children: [
      { path: 'liste-patients', component: PatientListComponent },
      { path: 'ajout-patient',   component: FormulairePatientComponent },
      { path: '', redirectTo: 'liste-patients', pathMatch: 'full' },
      { path: 'patients/:id', component: PatientDetailComponent }
    ]
  },
  { path: '**', redirectTo: '' }
];
