import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { RouterOutlet, RouterModule } from '@angular/router';

@Component({
  selector: 'app-accueil',
  imports: [RouterModule, MatButtonModule],
  templateUrl: './accueil.component.html',
  styleUrl: './accueil.component.scss'
})
export class AccueilComponent {


}
