import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { SkinDataService } from '../../services/skin-data';

@Component({
  selector: 'app-privacy',
  imports: [RouterLink, CommonModule],
  templateUrl: './privacy.html',
  styleUrl: './privacy.css'
})
export class Privacy {

  constructor(public data: SkinDataService) {}

  settings = [
    { title: 'Save My Photos', desc: 'Keep scan photos in my history', on: true },
    { title: 'Cloud Processing', desc: 'Allow secure cloud analysis of images', on: true },
    { title: 'Anonymous Research', desc: 'Share anonymized data to improve the model', on: false },
    { title: 'Personalized Tips', desc: 'Use my survey answers for recommendations', on: true }
  ];

  confirming = false;
  deleted = false;

  toggle(i: number) {
    this.settings[i].on = !this.settings[i].on;
  }

  askDelete() {
    this.confirming = true;
  }

  cancelDelete() {
    this.confirming = false;
  }

  confirmDelete() {
    this.data.clearAll();
    this.confirming = false;
    this.deleted = true;
    setTimeout(() => this.deleted = false, 3000);
  }
}