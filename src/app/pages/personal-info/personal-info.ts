import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-personal-info',
  imports: [RouterLink, CommonModule],
  templateUrl: './personal-info.html',
  styleUrl: './personal-info.css'
})
export class PersonalInfo {
  saved = false;

  save() {
    this.saved = true;
    setTimeout(() => this.saved = false, 2500);
  }
}