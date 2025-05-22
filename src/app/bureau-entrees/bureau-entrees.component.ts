import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { Router, RouterModule, RouterOutlet } from '@angular/router';
import { routes } from '../app.routes';

@Component({
  selector: 'app-bureau-entrees',
  imports: [RouterModule,RouterOutlet,MatButtonModule],
  templateUrl: './bureau-entrees.component.html',
  styleUrl: './bureau-entrees.component.scss'
})
export class BureauEntreesComponent {

  private router = inject(Router);

  goToPatients() {
    this.router.navigate(['/liste-patients']);
  }
 
  ajoutPatient() {
    this.router.navigate(['/ajout-patient']);
  }
}
