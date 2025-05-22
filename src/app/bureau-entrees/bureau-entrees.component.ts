import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { Router, RouterModule, RouterOutlet } from '@angular/router';

@Component({
  imports: [MatButtonModule, RouterOutlet, RouterModule],
  templateUrl: './bureau-entrees.component.html',
  styleUrl: './bureau-entrees.component.scss'
})
export class BureauEntreesComponent {


 
}
