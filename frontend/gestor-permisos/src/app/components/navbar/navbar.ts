import { Component, OnInit } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Auth, LoginEntry } from '../../services/auth';

type UsuariSessio = LoginEntry;

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, CommonModule],
  templateUrl: './navbar.html',
  styleUrls: ['./navbar.scss'],
})
export class Navbar implements OnInit {
  user: UsuariSessio | null = null;

  constructor(private router: Router, private auth: Auth) {}

  ngOnInit(): void {
    this.user = this.auth.getCurrentUser();
  }

  logout(): void {
    this.auth.clearSession();
    this.router.navigate(['/login']);
  }
}
