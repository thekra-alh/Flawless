import { Injectable } from '@angular/core';

export interface ScanRecord {
  date: string;
  skinType: string;
  score: number;
  photo: string | null;
}

@Injectable({ providedIn: 'root' })
export class SkinDataService {

  userName = 'Sara';
  userEmail = 'sara@example.com';

  answers: (number | null)[] = [null, null, null, null, null];
  photo: string | null = null;

  history: ScanRecord[] = [];

  constructor() {
    this.load();
  }

  private save() {
    try {
      localStorage.setItem('flawless', JSON.stringify({
        userName: this.userName,
        userEmail: this.userEmail,
        answers: this.answers,
        history: this.history
      }));
    } catch {}
  }

  private load() {
    try {
      const raw = localStorage.getItem('flawless');
      if (!raw) return;
      const d = JSON.parse(raw);
      this.userName = d.userName ?? this.userName;
      this.userEmail = d.userEmail ?? this.userEmail;
      this.answers = d.answers ?? this.answers;
      this.history = d.history ?? [];
    } catch {}
  }

  clearAll() {
    this.userName = 'Sara';
    this.userEmail = 'sara@example.com';
    this.answers = [null, null, null, null, null];
    this.photo = null;
    this.history = [];
    try { localStorage.removeItem('flawless'); } catch {}
  }

  saveUser(name: string, email: string) {
    if (name) this.userName = name;
    if (email) this.userEmail = email;
    this.save();
  }

  saveAnswers(a: (number | null)[]) {
    this.answers = [...a];
    this.save();
  }

  savePhoto(dataUrl: string) {
    this.photo = dataUrl;
  }

  saveScan() {
    this.history.unshift({
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      skinType: this.skinType,
      score: this.score,
      photo: this.photo
    });
    if (this.history.length > 10) this.history = this.history.slice(0, 10);
    this.save();
  }

  get skinType(): string {
    const types = ['Oily Skin', 'Dry Skin', 'Combination Skin', 'Normal Skin'];
    const i = this.answers[0];
    return i === null ? 'Combination Skin' : types[i];
  }

  get score(): number {
    let s = 90;
    if (this.answers[1] === 0) s -= 15;
    if (this.answers[1] === 1) s -= 8;
    if (this.answers[3] === 2) s -= 10;
    if (this.answers[3] === 3) s -= 16;
    if (this.answers[4] === 3) s -= 12;
    return Math.max(40, Math.min(100, s));
  }

  get hydration(): string {
    return this.answers[0] === 1 || this.answers[2] === 3 ? 'Needs Moisture' : 'Balanced';
  }

  get inflammation(): string {
    if (this.answers[2] === 0) return 'Moderate';
    return this.answers[1] === 0 ? 'Elevated' : 'Low';
  }

  get radiance(): string {
    return this.answers[2] === 1 ? 'Dull Areas' : 'Even';
  }

  get barrier(): string {
    return this.answers[1] === 0 ? 'Compromised' : 'Intact';
  }

  get scanCount(): number {
    return this.history.length;
  }

  get lastScore(): number {
    return this.history.length ? this.history[0].score : 0;
  }

  get progress(): number {
    if (this.history.length < 2) return 0;
    return this.history[0].score - this.history[this.history.length - 1].score;
  }

  get tips(): { title: string; text: string }[] {
    const i = this.answers[2];
    if (i === 0) return [
      { title: 'Niacinamide Serum', text: 'Apply 5–10% daily to regulate sebum.' },
      { title: 'Daily SPF 50+', text: 'Protect every morning, rain or shine.' }
    ];
    if (i === 1) return [
      { title: 'Vitamin C Serum', text: 'Use each morning to brighten uneven tone.' },
      { title: 'Daily SPF 50+', text: 'Essential to prevent new dark spots.' }
    ];
    if (i === 2) return [
      { title: 'Retinol', text: 'Start 2 nights a week and build up slowly.' },
      { title: 'Daily SPF 50+', text: 'The most effective anti-aging step.' }
    ];
    return [
      { title: 'Hyaluronic Acid', text: 'Apply on damp skin, then seal with moisturizer.' },
      { title: 'Ceramide Cream', text: 'Use nightly to restore the skin barrier.' }
    ];
  }
}