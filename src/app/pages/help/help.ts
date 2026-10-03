import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-help',
  imports: [RouterLink, CommonModule],
  templateUrl: './help.html',
  styleUrl: './help.css'
})
export class Help {

  open: number | null = null;

  faqs = [
    {
      q: 'How accurate is the skin analysis?',
      a: 'Flawless uses a trained deep learning model to identify visible skin characteristics. Results are informational guidance, not a medical diagnosis.'
    },
    {
      q: 'Are my photos stored?',
      a: 'Photos are processed for analysis only. You control whether they are saved in your history from Privacy Settings.'
    },
    {
      q: 'How often should I scan my skin?',
      a: 'Once every one to two weeks is enough to notice meaningful changes over time.'
    },
    {
      q: 'Can Flawless detect skin cancer?',
      a: 'No. Flawless does not detect or diagnose medical conditions. Please consult a certified dermatologist for any concerning changes.'
    },
    {
      q: 'Why do my results change between scans?',
      a: 'Lighting, camera angle, time of day, and recent product use can all affect the analysis. Scan in consistent lighting for best results.'
    },
    {
      q: 'How do I get the best scan quality?',
      a: 'Use natural daylight, keep a neutral expression, remove makeup, and hold the device about an arm’s length away.'
    }
  ];

  toggle(i: number) {
    this.open = this.open === i ? null : i;
  }
}