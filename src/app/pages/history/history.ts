import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { SkinDataService } from '../../services/skin-data';

@Component({
  selector: 'app-history',
  imports: [RouterLink, CommonModule],
  templateUrl: './history.html',
  styleUrl: './history.css'
})
export class History {
  constructor(public data: SkinDataService) {}
}