export interface Empleat {
  _id?: string;
  nom: string;
  primerCognom: string;
  segonCognom?: string;
  email: string;
  usuari: string;
  password?: string;
  imatge?: string;
  rol: 'admin' | 'basic';
}
