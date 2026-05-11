import { Component, OnInit } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';

type UsuariSessio = {
  id?: string;
  nom?: string;
  usuari?: string;
  rol?: 'admin' | 'basic';
};

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, CommonModule],
  templateUrl: './navbar.html',
  styleUrls: ['./navbar.scss'],
})
export class Navbar implements OnInit {
  user: UsuariSessio | null = null;

  constructor(private router: Router) {}

  ngOnInit(): void {
    const raw = localStorage.getItem('user');
    this.user = raw ? JSON.parse(raw) : null;
  }

  logout(): void {
    localStorage.removeItem('user');
    this.router.navigate(['/login']);
  }
}
