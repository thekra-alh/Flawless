import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { SkinDataService } from '../../services/skin-data';

@Component({
  selector: 'app-survey',
  imports: [RouterLink, CommonModule],
  templateUrl: './survey.html',
  styleUrl: './survey.css'
})
export class SurveyComponent {

  constructor(private data: SkinDataService, private router: Router) {}

  current = 0;

  questions = [
    { title: 'What is your skin type?', options: ['Oily', 'Dry', 'Combination', 'Normal / Sensitive'] },
    { title: 'How often does your skin react to products?', options: ['Always', 'Sometimes', 'Rarely', 'Never'] },
    { title: 'What is your primary skin concern?', options: ['Acne & breakouts', 'Dark spots & uneven tone', 'Fine lines & aging', 'Dryness & dehydration'] },
    { title: 'Do you use sunscreen daily?', options: ['Yes, every day', 'Only when outdoors', 'Rarely', 'Never'] },
    { title: 'How often do you change your skincare routine?', options: ['Every few weeks', 'Every few months', 'Once a year', 'I have no routine'] }
  ];

  answers: (number | null)[] = [null, null, null, null, null];

  select(i: number) {
    this.answers[this.current] = i;
  }

  next() {
    if (this.current < this.questions.length - 1) this.current++;
  }

  back() {
    if (this.current > 0) this.current--;
  }

  finish() {
    this.data.saveAnswers(this.answers);
    this.router.navigate(['/camera']);
  }

  get isLast() {
    return this.current === this.questions.length - 1;
  }
}