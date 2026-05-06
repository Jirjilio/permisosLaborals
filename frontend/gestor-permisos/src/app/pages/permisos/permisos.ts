import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Permisos as PermisosService } from '../../services/permisos';
import { Permis, EstatPermis } from '../../models/permis';

type UsuariSessio = {
  id?: string;
  _id?: string;
  rol?: 'admin' | 'basic';
  usuari?: string;
};

@Component({
  selector: 'app-permisos',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './permisos.html',
  styleUrl: './permisos.scss',
})
export class Permisos implements OnInit {
  permisos: Permis[] = [];
  permisosFiltraciados: Permis[] = [];
  user: UsuariSessio | null = null;

  tipusOptions: string[] = [
    'hospitalitzacio',
    'matrimoni',
    'trasllat',
    'malaltia',
    'naixement',
    'altres',
  ];

  // Filtros
  filtreEstat: string = '';
  filtreCreador: string = '';
  filtreTramitador: string = '';

  creadors: string[] = [];
  tramitadors: string[] = [];

  permisObj: Permis = this.buildEmptyPermis();

  constructor(private permisosService: PermisosService) {}

  ngOnInit(): void {
    this.loadUser();
    this.loadPermisos();
    this.onReset();
  }

  get esAdmin(): boolean {
    return this.user?.rol === 'admin';
  }

  loadPermisos(): void {
    this.permisosService.getAll().subscribe({
      next: (data: Permis[]) => {
        const userId = this.getUserId();
        this.permisos = this.esAdmin ? data : data.filter((p) => p.empleatCreadorId === userId);
        this.updateFilterOptions();
        this.applyFilters();
      },
      error: (error: unknown) => {
        console.error('Error al cargar permisos:', error);
      },
    });
  }

  applyFilters(): void {
    this.permisosFiltraciados = this.permisos.filter(permis => {
      const matchEstat = !this.filtreEstat || permis.estat === this.filtreEstat;
      const matchCreador = !this.filtreCreador || permis.empleatCreadorId === this.filtreCreador;
      const matchTramitador = !this.filtreTramitador || permis.empleatTramitadorId === this.filtreTramitador;

      return matchEstat && matchCreador && matchTramitador;
    });
  }

  resetFilters(): void {
    this.filtreEstat = '';
    this.filtreCreador = '';
    this.filtreTramitador = '';
    this.applyFilters();
  }

  private updateFilterOptions(): void {
    this.creadors = Array.from(new Set(
      this.permisos.map(p => p.empleatCreadorId).filter((id): id is string => !!id)
    ));
    this.tramitadors = Array.from(new Set(
      this.permisos.map(p => p.empleatTramitadorId).filter((id): id is string => !!id)
    ));
  }


  onEdit(item: Permis): void {
    this.permisObj = { ...item };
  }

  onSavePermis(): void {
    if (!this.isFormValid()) {
      console.error('Completa los campos obligatorios');
      return;
    }

    const nowIso = new Date().toISOString();
    const creatorId = this.getUserId();

    const payload: Permis = {
      ...this.permisObj,
      empleatCreadorId: creatorId,
      dataCreacio: nowIso,
      estat: 'pendent',
      empleatTramitadorId: '',
      dataTramitacio: '',
    };

    this.permisosService.create(payload).subscribe({
      next: () => {
        this.loadPermisos();
        this.onReset();
      },
      error: (error: unknown) => {
        console.error('Error al guardar permiso:', error);
      },
    });
  }

  onUpdatePermis(): void {
    if (!this.permisObj.id) {
      console.error('ID de permiso no encontrado');
      return;
    }

    const payload: Permis = { ...this.permisObj };

    if (this.esAdmin && (payload.estat === 'aprovat' || payload.estat === 'refusat')) {
      payload.empleatTramitadorId = this.getUserId();
      payload.dataTramitacio = new Date().toISOString();
    }

    this.permisosService.update(this.permisObj.id, payload).subscribe({
      next: () => {
        this.loadPermisos();
        this.onReset();
      },
      error: (error: unknown) => {
        console.error('Error al actualizar permiso:', error);
      },
    });
  }

  onDeletePermis(id?: string): void {
    if (!id) {
      console.error('ID de permiso no encontrado');
      return;
    }

    if (confirm('¿Seguro que deseas eliminar este permiso?')) {
      this.permisosService.delete(id).subscribe({
        next: () => this.loadPermisos(),
        error: (error: unknown) => {
          console.error('Error al eliminar permiso:', error);
        },
      });
    }
  }

  onTramitar(permis: Permis, estat: EstatPermis): void {
    if (!this.esAdmin || !permis.id) {
      return;
    }

    const payload: Permis = {
      ...permis,
      estat,
      empleatTramitadorId: this.getUserId(),
      dataTramitacio: new Date().toISOString(),
    };

    this.permisosService.update(permis.id, payload).subscribe({
      next: () => this.loadPermisos(),
      error: (error: unknown) => {
        console.error('Error al tramitar permiso:', error);
      },
    });
  }

  onReset(): void {
    this.permisObj = this.buildEmptyPermis();
  }

  private buildEmptyPermis(): Permis {
    return {
      empleatCreadorId: this.getUserId(),
      dataCreacio: '',
      dataInici: '',
      dataFinal: '',
      tipus: '',
      descripcio: '',
      estat: 'pendent',
      empleatTramitadorId: '',
      dataTramitacio: '',
    };
  }

  private loadUser(): void {
    const raw = localStorage.getItem('user');
    this.user = raw ? (JSON.parse(raw) as UsuariSessio) : null;
  }

  private getUserId(): string {
    return this.user?.id ?? this.user?._id ?? '';
  }

  private isFormValid(): boolean {
    return !!(
      this.permisObj.dataInici &&
      this.permisObj.dataFinal &&
      this.permisObj.tipus &&
      this.permisObj.descripcio &&
      this.getUserId()
    );
  }
}
