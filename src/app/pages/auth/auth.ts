import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SkinDataService } from '../../services/skin-data';

@Component({
  selector: 'app-auth',
  imports: [RouterLink, CommonModule, FormsModule],
  templateUrl: './auth.html',
  styleUrl: './auth.css'
})
export class AuthComponent {

  constructor(private data: SkinDataService, private router: Router) {}

  isLogin = true;

  name = '';
  email = '';
  password = '';

  submit() {
    this.data.saveUser(this.name, this.email);
    this.router.navigate(['/survey']);
  }
}