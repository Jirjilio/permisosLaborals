import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Empleats as EmpleatsService } from '../../services/empleats';
import { Empleat } from '../../models/empleat';

@Component({
  selector: 'app-empleats',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './empleats.html',
  styleUrl: './empleats.scss',
})
export class Empleats implements OnInit {
  empleats: Empleat[] = [];

  empleatObj: Empleat = {
    nom: '',
    primerCognom: '',
    segonCognom: '',
    email: '',
    usuari: '',
    password: '',
    imatge: '',
    rol: 'basic',
  };

  constructor(private empleatsService: EmpleatsService) {}

  ngOnInit(): void {
    this.loadEmpleats();
  }

  loadEmpleats(): void {
    this.empleatsService.getAll().subscribe({
      next: (data: Empleat[]) => {
        this.empleats = data;
      },
      error: (error: unknown) => {
        console.error('Error al cargar empleats:', error);
      },
    });
  }

  onEdit(item: Empleat): void {
    this.empleatObj = { ...item };
  }

  onSaveEmpleat(): void {
    if (!this.isFormValid()) {
      console.error('Por favor completa los campos obligatorios');
      return;
    }

    this.empleatsService.create(this.empleatObj).subscribe({
      next: (response: Empleat) => {
        console.log('Empleado guardado correctamente:', response);
        this.loadEmpleats();
        this.onReset();
      },
      error: (error: unknown) => {
        console.error('Error al guardar empleado:', error);
      },
    });
  }

  onUpdateEmpleat(): void {
    if (!this.empleatObj.id) {
      console.error('ID de empleado no encontrado');
      return;
    }

    this.empleatsService.update(this.empleatObj.id, this.empleatObj).subscribe({
      next: (response: Empleat) => {
        console.log('Empleado actualizado correctamente:', response);
        this.loadEmpleats();
        this.onReset();
      },
      error: (error: unknown) => {
        console.error('Error al actualizar empleado:', error);
      },
    });
  }

  onDeleteEmpleat(id?: string): void {
    if (!id) {
      console.error('ID de empleado no encontrado');
      return;
    }

    if (confirm('¿Estás seguro de que deseas eliminar este empleado?')) {
      this.empleatsService.delete(id).subscribe({
        next: () => {
          console.log('Empleado eliminado correctamente');
          this.loadEmpleats();
        },
        error: (error: unknown) => {
          console.error('Error al eliminar empleado:', error);
        },
      });
    }
  }

  onReset(): void {
    this.empleatObj = {
      nom: '',
      primerCognom: '',
      segonCognom: '',
      email: '',
      usuari: '',
      password: '',
      imatge: '',
      rol: 'basic',
    };
  }

  private isFormValid(): boolean {
    return !!(
      this.empleatObj.nom &&
      this.empleatObj.primerCognom &&
      this.empleatObj.email &&
      this.empleatObj.usuari &&
      this.empleatObj.password &&
      this.empleatObj.rol
    );
  }
}
