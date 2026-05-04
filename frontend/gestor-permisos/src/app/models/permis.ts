export type EstatPermis = 'pendent' | 'aprovat' | 'refusat';

export interface Permis {
  id?: string;
  empleatCreadorId: string;
  dataCreacio: string;
  dataInici: string;
  dataFinal: string;
  tipus: string;
  descripcio: string;
  estat: EstatPermis;
  empleatTramitadorId?: string;
  dataTramitacio?: string;
}
