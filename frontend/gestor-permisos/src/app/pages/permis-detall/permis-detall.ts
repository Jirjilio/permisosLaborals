import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { forkJoin } from 'rxjs';

import { Empleats as EmpleatsService } from '../../services/empleats';
import { Permisos as PermisosService } from '../../services/permisos';
import { NotificacionesService } from '../../services/notificaciones.service';
import { Empleat } from '../../models/empleat';
import { Permis, EstatPermis } from '../../models/permis';

type UsuariSessio = {
  id?: string;
  _id?: string;
  rol?: 'admin' | 'basic';
  usuari?: string;
};

@Component({
  selector: 'app-permis-detall',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './permis-detall.html',
  styleUrl: './permis-detall.scss',
})
export class PermisDetall implements OnInit {
  permis: Permis | null = null;
  empleats: Empleat[] = [];
  loading = true;
  errorMessage = '';
  isEditing = false;
  user: UsuariSessio | null = null;

  tipusOptions: string[] = [
    'hospitalitzacio',
    'matrimoni',
    'trasllat',
    'malaltia',
    'naixement',
    'altres',
  ];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private permisosService: PermisosService,
    private empleatsService: EmpleatsService,
    private notificaciones: NotificacionesService
  ) {}

  ngOnInit(): void {
    this.loadUser();
    this.isEditing = window.history.state?.mode === 'edit';

    const id = this.route.snapshot.paramMap.get('id');
    if (!id) {
      this.loading = false;
      this.errorMessage = 'No s\'ha trobat el permís.';
      return;
    }

    forkJoin({
      permis: this.permisosService.getById(id),
      empleats: this.empleatsService.getAll(),
    }).subscribe({
      next: ({ permis, empleats }) => {
        this.permis = permis;
        this.empleats = empleats;
        this.loading = false;
      },
      error: (error: unknown) => {
        console.error('Error al cargar detalle del permiso:', error);
        this.loading = false;
        this.errorMessage = 'No s\'ha pogut carregar el detall del permís.';
        this.notificaciones.error('Error al cargar el detall');
      },
    });
  }

  get esAdmin(): boolean {
    return this.user?.rol === 'admin';
  }

  getEmpleatNom(id?: string): string {
    if (!id) {
      return '—';
    }

    const empleat = this.empleats.find((e) => e.id === id);
    if (!empleat) {
      return id;
    }

    return `${empleat.nom} ${empleat.primerCognom}`.trim();
  }

  getStatusLabel(estat?: EstatPermis): string {
    switch (estat) {
      case 'aprovat':
        return 'Aprovat';
      case 'refusat':
        return 'Refusat';
      default:
        return 'Pendent';
    }
  }

  getStatusClass(estat?: EstatPermis): string {
    switch (estat) {
      case 'aprovat':
        return 'badge-aprovat';
      case 'refusat':
        return 'badge-refusat';
      default:
        return 'badge-pendent';
    }
  }

  goBack(): void {
    this.router.navigate(['/permisos']);
  }

  enableEdit(): void {
    this.isEditing = true;
  }

  cancelEdit(): void {
    this.isEditing = false;
  }

  saveChanges(): void {
    if (!this.permis?.id) {
      return;
    }

    const payload: Permis = {
      ...this.permis,
      dataCreacio: this.permis.dataCreacio,
      empleatCreadorId: this.permis.empleatCreadorId,
    };

    if (this.esAdmin && payload.estat !== 'pendent') {
      payload.empleatTramitadorId = this.user?.id ?? this.user?._id ?? '';
      payload.dataTramitacio = new Date().toISOString();
    }

    this.permisosService.update(this.permis.id, payload).subscribe({
      next: (updated) => {
        this.permis = updated;
        this.isEditing = false;
        this.notificaciones.success('Permís actualitzat correctament');
      },
      error: (error: unknown) => {
        console.error('Error al guardar el permiso:', error);
        this.notificaciones.error('Error al guardar el permís');
      },
    });
  }

  private loadUser(): void {
    const raw = localStorage.getItem('user');
    this.user = raw ? (JSON.parse(raw) as UsuariSessio) : null;
  }
}
