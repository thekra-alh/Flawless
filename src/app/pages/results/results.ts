import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { SkinDataService } from '../../services/skin-data';

@Component({
  selector: 'app-results',
  imports: [RouterLink, CommonModule],
  templateUrl: './results.html',
  styleUrl: './results.css'
})
export class ResultsComponent {
  constructor(public data: SkinDataService) {}
}