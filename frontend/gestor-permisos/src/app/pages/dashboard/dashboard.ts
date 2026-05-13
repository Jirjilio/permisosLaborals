import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Chart } from 'chart.js/auto';

import { Permisos as PermisosService } from '../../services/permisos';
import { Permis } from '../../models/permis';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard.html',
  styleUrls: ['./dashboard.scss'],
})
export class Dashboard implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('pieChart') pieChart?: ElementRef<HTMLCanvasElement>;

  permisos: Permis[] = [];

  totalPendents = 0;
  totalAprovats = 0;
  totalRefusats = 0;

  private chart?: Chart<'doughnut', number[], string>;

  constructor(private permisosService: PermisosService) {}

  ngOnInit(): void {
    this.loadPermisos();
  }

  ngAfterViewInit(): void {
    this.renderChart();
  }

  ngOnDestroy(): void {
    this.chart?.destroy();
  }

  private loadPermisos(): void {
    this.permisosService.getAll().subscribe({
      next: (data) => {
        this.permisos = data;
        this.calculateCounts();
        this.renderChart();
      },
      error: (error: unknown) => {
        console.error('Error al cargar permisos:', error);
      },
    });
  }

  private calculateCounts(): void {
    this.totalPendents = this.permisos.filter((p) => p.estat === 'pendent').length;
    this.totalAprovats = this.permisos.filter((p) => p.estat === 'aprovat').length;
    this.totalRefusats = this.permisos.filter((p) => p.estat === 'refusat').length;
  }

  private renderChart(): void {
    if (!this.pieChart?.nativeElement) {
      return;
    }

    const ctx = this.pieChart.nativeElement.getContext('2d');
    if (!ctx) {
      return;
    }

    this.chart?.destroy();

    const total = this.totalPendents + this.totalAprovats + this.totalRefusats;
    const hasData = total > 0;

    const labels = hasData
      ? ['Pendent', 'Aprovat', 'Refusat']
      : ['Sense permisos'];

    const values = hasData
      ? [this.totalPendents, this.totalAprovats, this.totalRefusats]
      : [1];

    const colors = hasData
      ? ['#f59e0b', '#22c55e', '#ef4444']
      : ['#374151'];

    this.chart = new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels,
        datasets: [
          {
            data: values,
            backgroundColor: colors,
            borderColor: '#161616',
            borderWidth: 2,
            hoverOffset: 8,
            spacing: 4,
            borderRadius: 8,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        cutout: '62%',
        plugins: {
          legend: {
            display: hasData,
            position: 'bottom',
            labels: {
              color: '#888888',
              usePointStyle: true,
              pointStyle: 'circle',
              padding: 18,
              boxWidth: 10,
            },
          },
          tooltip: {
            enabled: hasData,
            backgroundColor: '#111111',
            borderColor: '#222222',
            borderWidth: 1,
            titleColor: '#f0f0f0',
            bodyColor: '#f0f0f0',
            padding: 12,
            callbacks: {
              label: (context) => {
                if (!hasData) {
                  return 'No hi ha permisos registrats';
                }

                const value = Number(context.raw) || 0;
                const percentage = total > 0 ? Math.round((value / total) * 100) : 0;

                return `${context.label}: ${value} (${percentage}%)`;
              },
            },
          },
        },
        animation: {
          animateRotate: true,
          animateScale: true,
        },
      },
    });
  }
}
