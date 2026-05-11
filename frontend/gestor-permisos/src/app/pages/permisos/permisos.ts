import { Component, OnInit } from '@angular/core';
      import { CommonModule } from '@angular/common';
      import { FormsModule } from '@angular/forms';
      import { Router } from '@angular/router';
      import { Permisos as PermisosService } from '../../services/permisos';
      import { Empleats as EmpleatsService } from '../../services/empleats';
      import { Permis, EstatPermis } from '../../models/permis';
      import { Empleat } from '../../models/empleat';
import { NotificacionesService } from '../../services/notificaciones';
              


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
        empleats: Empleat[] = [];
        user: UsuariSessio | null = null;

        tipusOptions: string[] = [
          'hospitalitzacio',
          'matrimoni',
          'trasllat',
          'malaltia',
          'naixement',
          'altres',
        ];

        filtreEstat: string = '';
        filtreCreador: string = '';
        filtreTramitador: string = '';

        creadors: string[] = [];
        tramitadors: string[] = [];

        permisObj: Permis = this.buildEmptyPermis();

        constructor(
          private permisosService: PermisosService,
          private empleatsService: EmpleatsService,
          private router: Router,
          private notificaciones: NotificacionesService
        ) {}

        ngOnInit(): void {
          this.loadUser();
          this.loadEmpleats();
          this.loadPermisos();
          this.onReset();
        }

        get esAdmin(): boolean {
          return this.user?.rol === 'admin';
        }

        loadEmpleats(): void {
          this.empleatsService.getAll().subscribe({
            next: (data) => {
              this.empleats = data;
            },
            error: (error: unknown) => {
              console.error('Error al cargar empleados:', error);
              this.notificaciones.error('Error al cargar empleados');
            },
          });
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
              this.notificaciones.error('Error al cargar permisos');
            },
          });
        }

        applyFilters(): void {
          this.permisosFiltraciados = this.permisos.filter((permis) => {
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
          this.creadors = Array.from(
            new Set(this.permisos.map((p) => p.empleatCreadorId).filter((id): id is string => !!id))
          );

          this.tramitadors = Array.from(
            new Set(this.permisos.map((p) => p.empleatTramitadorId).filter((id): id is string => !!id))
          );
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

        openDetail(item: Permis, editMode = false): void {
          if (!item.id) {
            return;
          }

          this.router.navigate(['/permisos', item.id], {
            state: { mode: editMode ? 'edit' : 'view' },
          });
        }

        onEdit(item: Permis): void {
          this.openDetail(item, true);
        }

        onSavePermis(): void {
          if (!this.isFormValid()) {
            this.notificaciones.warning('Completa els camps obligatoris');
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
              this.notificaciones.success('Permís creat correctament');
              this.loadPermisos();
              this.onReset();
            },
            error: (error: unknown) => {
              console.error('Error al guardar permiso:', error);
              this.notificaciones.error('Error al crear el permís');
            },
          });
        }

        onUpdatePermis(): void {
          if (!this.permisObj.id) {
            this.notificaciones.warning('ID de permiso no encontrado');
            return;
          }

          const payload: Permis = { ...this.permisObj };

          if (this.esAdmin && (payload.estat === 'aprovat' || payload.estat === 'refusat')) {
            payload.empleatTramitadorId = this.getUserId();
            payload.dataTramitacio = new Date().toISOString();
          }

          this.permisosService.update(this.permisObj.id, payload).subscribe({
            next: () => {
              this.notificaciones.success('Permís actualitzat correctament');
              this.loadPermisos();
              this.onReset();
            },
            error: (error: unknown) => {
              console.error('Error al actualizar permiso:', error);
              this.notificaciones.error('Error al actualitzar el permís');
            },
          });
        }

        onDeletePermis(id?: string): void {
          if (!id) {
            this.notificaciones.warning('ID de permiso no encontrado');
            return;
          }

          if (confirm('Segur que vols eliminar aquest permís?')) {
            this.permisosService.delete(id).subscribe({
              next: () => {
                this.notificaciones.success('Permís eliminat correctament');
                this.loadPermisos();
              },
              error: (error: unknown) => {
                console.error('Error al eliminar permiso:', error);
                this.notificaciones.error('Error al eliminar el permís');
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
            next: () => {
              const mensaje = estat === 'aprovat' ? 'Permís aprovat' : 'Permís refusat';
              this.notificaciones.success(mensaje);
              this.loadPermisos();
            },
            error: (error: unknown) => {
              console.error('Error al tramitar permiso:', error);
              this.notificaciones.error('Error al tramitar el permís');
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
