import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-notifications',
  imports: [RouterLink, CommonModule],
  templateUrl: './notifications.html',
  styleUrl: './notifications.css'
})
export class Notifications {

  settings = [
    { title: 'Scan Reminders', desc: 'Remind me to scan my skin weekly', on: true },
    { title: 'Routine Alerts', desc: 'Morning and night skincare reminders', on: true },
    { title: 'Progress Updates', desc: 'Notify me when my skin score changes', on: true },
    { title: 'Tips & Advice', desc: 'Weekly skincare tips based on my skin type', on: false },
    { title: 'Product Suggestions', desc: 'New ingredient recommendations', on: false }
  ];

  toggle(i: number) {
    this.settings[i].on = !this.settings[i].on;
  }
}